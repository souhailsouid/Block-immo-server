import * as admin from 'firebase-admin';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  async updateUserProfile(uid: string, email: string, data: any) {
    try {
      const updatedData = {
        ...data,
        email: email, // Remplacer l'email par celui provenant du token authentifié
      };
      // Valider les données entrantes
      const validData = this.validateUserProfileData(updatedData);
      if (!validData.isValid) {
        throw new BadRequestException(validData.message); // Lever une exception avec un message explicite
      }

      // Mettre à jour le profil de l'utilisateur dans Firestore
      const userRef = admin.firestore().collection('users').doc(uid);
      const writeResult = await userRef.set(updatedData, { merge: true });

      // Retourner un message de succès avec les données sauvegardées
      return {
        message: 'Profil utilisateur mis à jour avec succès.',
        updatedData,
        writeTime: writeResult.writeTime.toDate(),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Renvoyer les erreurs de validation au client
      } else {
        console.error(
          'Erreur lors de la mise à jour du profil utilisateur :',
          error?.message,
        );
        throw new InternalServerErrorException(
          'Une erreur est survenue lors de la mise à jour du profil utilisateur.',
        );
      }
    }
  }

  validateUserProfileData(data: any) {
    const requiredFields = ['displayName', 'phone', 'address', 'email'];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Les champs suivants sont manquants : ${missingFields.join(', ')}`,
      };
    }

    if (!this.isValidEmail(data.email)) {
      return {
        isValid: false,
        message: "Le format de l'adresse email est invalide.",
      };
    }

    return {
      isValid: true,
      message: 'Les données sont valides.',
    };
  }

  isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getUserProfile(uid: string) {
    const authUser = await admin.auth().getUser(uid);

    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const combinedUserProfile = {
      uid: authUser.uid,
      email: authUser.email,
      emailVerified: authUser.emailVerified,
      displayName: authUser.displayName || userData['displayName'],
      phoneNumber: authUser.phoneNumber || userData['phone'],
      address: userData['address'],
      role: authUser.customClaims?.role || 'user',
      photoURL: authUser.photoURL,
      metadata: authUser.metadata,
      customsClaims: authUser.customClaims,
    };

    return combinedUserProfile;
  }
}
