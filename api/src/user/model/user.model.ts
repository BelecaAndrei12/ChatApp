export interface User {
    id?: number;
    username?: string;
    email: string;
    password: string;
    publicKey?: string;
    privateKey?: string;
  }