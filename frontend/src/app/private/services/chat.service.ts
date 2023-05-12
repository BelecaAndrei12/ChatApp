import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatRoom } from "src/app/models/chat-room.model";
import { User } from "src/app/models/user.model";
import { CustomSocket } from "src/app/sockets/custom-socket";

@Injectable({
  providedIn:'root'
})
export class ChatService {

  constructor(private socket: CustomSocket) {}

  getMessage() {
    return this.socket.fromEvent('message');
  }

  getChatRoomsForUser(): Observable<ChatRoom[]>{
    return this.socket.fromEvent<ChatRoom[]>('chat-rooms');
  }

  createChatRoom(chatRoom: ChatRoom) {
    this.socket.emit('createChatRoom',chatRoom)
  }
}

