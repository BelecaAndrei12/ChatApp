import { ChatRoom } from "src/chat/model/chat-room.model";
import { User } from "./user.model";

export interface Connection {
  id?: number;
  socketId: string;
  user: User;
  chatRoom?: ChatRoom
}