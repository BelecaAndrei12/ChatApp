import { Injectable } from "@nestjs/common";
import { EncryptionKey } from "./encryption.model";
import { generateKeyPairSync } from "crypto";

@Injectable()
export class EncryptionService {
    generateKeyPair(): EncryptionKey {
        const { publicKey, privateKey } = generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        });

        return {
            publicKey: publicKey,
            privateKey: privateKey
        };
    }
}
