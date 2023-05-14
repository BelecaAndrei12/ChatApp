import { User } from "src/user/model/user.model";
import { ChatRoom } from "./chat-room.model";

export interface Message {
  id?: number;
  content: string;
  user: User;
  chatRoom: ChatRoom;
  created: Date;
}