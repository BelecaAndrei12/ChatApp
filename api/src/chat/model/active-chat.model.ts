import { User } from "src/user/model/user.model";
import { ChatRoom } from "./chat-room.model";

export interface ActiveChat {
    id?: number;
    user: User;
    socketId: string;
    chatRoom: ChatRoom,
  }