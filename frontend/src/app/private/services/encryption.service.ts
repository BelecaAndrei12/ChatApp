import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/public/services/auth.service';
import { JSEncrypt } from 'jsencrypt';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {


  privateKey = this.authService.getLoggedUser().privateKey;
  publicKey = this.authService.getLoggedUser().publicKey;

  private encryptor: JSEncrypt;

  constructor(private authService: AuthService) {
    this.encryptor = new JSEncrypt();
    this.encryptor.setPublicKey(this.publicKey);
    this.encryptor.setPrivateKey(this.privateKey);
  }

  async encryptMessage(message: string){
    const encryptedMessage = this.encryptor.encrypt(message);
    return encryptedMessage;
  }


  async decryptMessage(encryptedMessage: string) {
    const decryptedMessage = await this.encryptor.decrypt(encryptedMessage);
    return decryptedMessage;
  }

  async logDecryptedMessage(encryptedMessage: string): Promise<void> {
    const decryptedMessage = await this.decryptMessage(encryptedMessage);
    console.log('Decrypted message:', decryptedMessage);
  }

  async logEncryptedMessage(message: string): Promise<void> {
    const encryptedMessage = await this.encryptMessage(message);
    console.log('Encrypted message:', encryptedMessage);
  }



}

