import { ChatRoom } from "./chat-room.model";
import { User } from "./user.model";

export interface Message {
  id?: number,
  content?: string,
  created?: Date,
  user?: User,
  chatRoom?: ChatRoom,
}
