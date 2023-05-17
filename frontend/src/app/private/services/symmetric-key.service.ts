import { Injectable } from '@angular/core';
import { ChatRoom } from 'src/app/models/chat-room.model';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SymmetricKeyService {
  decryptAndReconstructSymmetricKey(chatRoom: ChatRoom): string {
    const encryptedKeys = JSON.parse(chatRoom.encryptedSymmetricKey);
    const decryptedKeys = [];

    // Decrypt each encrypted symmetric key using the corresponding user's private key
    chatRoom.users.forEach((user, index) => {
      try {
        const privateKey = this.extractPrivateKey(user.privateKey);
        console.log('Private Key:', privateKey);
        console.log(encryptedKeys)
        const decryptedKey = CryptoJS.AES.decrypt(
          encryptedKeys[index],
          privateKey,
          { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        ).toString(CryptoJS.enc.Utf8);
        console.log('Decrypted Key:', decryptedKey);

        decryptedKeys.push(decryptedKey);
      } catch (error) {
        console.error('Error decrypting key:', error);
      }
    });

    // Combine the decrypted symmetric keys into a single string
    const combinedKeys = decryptedKeys.join('');

    return combinedKeys;
  }

  private extractPrivateKey(privateKey: string): CryptoJS.lib.WordArray {
    // Remove the header and footer lines
    const headersRemoved = privateKey
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '');

    // Remove line breaks and whitespace characters
    const strippedKey = headersRemoved.replace(/\r?\n|\r/g, '').trim();

    // Decode from Base64
    const decodedKey = CryptoJS.enc.Base64.parse(strippedKey);

    return decodedKey;
  }


}
