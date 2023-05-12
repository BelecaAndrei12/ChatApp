import { User } from "./user.model";

export interface ChatRoom {
  id?: number;
  name?: string;
  creationDate?: Date;
  lastUpdated?: Date;
  users?: User[];
}
