import { Injectable } from "@nestjs/common";
import { publicEncrypt, randomBytes } from "crypto";
import { ChatRoom } from "src/chat/model/chat-room.model";

@Injectable()
export class SymmetricKeyService {

    private readonly keyLength = 32;

    generateSymmetricKey(): Buffer {
        return randomBytes(this.keyLength);
    }

    encryptSymmetricKey(chatRoom: ChatRoom, symmetricKey: Buffer): string {
        const encryptedKeys = [];

        for (const user of chatRoom.users) {
            const encryptedKey = publicEncrypt(user.publicKey, symmetricKey);
            encryptedKeys.push({userId: user.id, key:encryptedKey});
        }
        chatRoom.users.forEach((user) => console.log(user.username))
        return JSON.stringify(encryptedKeys);
    }

    // addNewKey(chatRoom: ChatRoom): string {
        
    // }
      
}
