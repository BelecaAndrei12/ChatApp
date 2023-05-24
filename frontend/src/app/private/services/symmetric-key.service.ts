import { Injectable } from '@angular/core';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { createCipheriv, createDecipheriv,privateDecrypt, publicEncrypt } from 'crypto';
import { Buffer } from 'buffer';
import { AuthService } from 'src/app/public/services/auth.service';
import { User } from 'src/app/models/user.model';


@Injectable({
  providedIn: 'root',
})

export class SymmetricKeyService {

  constructor(private authService: AuthService) {}

  decryptSymmetricKey(chatRoom: ChatRoom): Buffer {
    const privateKey = this.authService.getLoggedUser().privateKey;
    const encryptedKeys = JSON.parse(chatRoom.encryptedSymmetricKey);
    const encryptedKey = encryptedKeys.find((symmetricKey) => symmetricKey.userId === this.authService.getLoggedUser().id);

    if (encryptedKey) {
      const encryptedData = Buffer.from(encryptedKey.key.data);
      const decryptedKey = privateDecrypt(privateKey, encryptedData);
      return Buffer.from(decryptedKey);
    } else {
      throw new Error('Encrypted symmetric key not found for the logged-in user.');
    }
  }

  encryptSymmetricKeyForInvitedUsers(users: User[], symmetricKey : Buffer, encryptedKeys){
    for (const user of users) {
      const encryptedKey = publicEncrypt(user.publicKey, symmetricKey);
      encryptedKeys.push({userId: user.id, key:encryptedKey});
  }
     users.forEach((user) => console.log(user.username))
     return JSON.stringify(encryptedKeys);
  }

  removeUserKeyOnLeave(userId: number,encryptedKey) {
    const encryptedKeys = encryptedKey.filter((key) => key.userId !== userId)
    return JSON.stringify(encryptedKeys);
  }



  encryptMessage(symmetricKey: Buffer, message: string): string {
    const iv = this.generateRandomIV();
    const cipher = createCipheriv('aes-256-cbc', symmetricKey, iv);
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const encryptedMessage = iv.toString('base64') + ':' + encrypted;
    return encryptedMessage;
  }

  decryptMessage(symmetricKey: Buffer, encryptedMessage: string): string {
    const [ivString, encryptedString] = encryptedMessage.split(':');
    const iv = Buffer.from(ivString, 'base64');
    const encryptedData = Buffer.from(encryptedString, 'base64');
    const decipher = createDecipheriv('aes-256-cbc', symmetricKey, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private generateRandomIV(): Buffer {
    const iv = new Uint8Array(16);
    window.crypto.getRandomValues(iv);
    return Buffer.from(iv);
  }

}
