import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ChatRoom } from "src/app/models/chat-room.model";
import { Message } from "src/app/models/message.model";
import { CustomSocket } from "src/app/sockets/custom-socket";
import { EncryptionService } from "./encryption.service";
import { User } from "src/app/models/user.model";
import { SymmetricKeyService } from "./symmetric-key.service";

@Injectable({
  providedIn:'root'
})
export class ChatService {

  constructor(
    private socket: CustomSocket,
    private symmetricKeyService: SymmetricKeyService
    ) {}

  getMessage() {
    return this.socket.fromEvent('message');
  }

  getChatRoomsForUser(): Observable<ChatRoom[]>{
    return this.socket.fromEvent<ChatRoom[]>('chat-rooms');
  }

  createChatRoom(chatRoom: ChatRoom) {
    this.socket.emit('createChatRoom',chatRoom)
  }

  joinRoom(chatRoom: ChatRoom) {
    this.socket.emit('joinRoom', chatRoom);
  }

  leaveRoom(chatRoom: ChatRoom) {
    this.socket.emit('leaveRoom',chatRoom);
  }

  inviteUserToChatRoom(chatRoom: ChatRoom) {
    console.log(chatRoom.users)
    this.socket.emit('inviteUser',chatRoom);
  }

  leaveChatRoom(chatRoom: ChatRoom, user: User) {
    this.socket.emit('leaveChatRoom',chatRoom,user);
  }

  reloadChatRooms(user: User) {
    this.socket.emit('reloadChatRooms', user)
  }

  sendMessage(symmetricKey:Buffer,message: Message) {
    message.content = this.symmetricKeyService.encryptMessage(symmetricKey,message.content)
    this.socket.emit('addMessage', message)
  }

  getMessages(): Observable<Message[]> {
    return this.socket.fromEvent('messages');
  }

  getAddedMessage(): Observable<Message> {
    this.getMessages()
    return this.socket.fromEvent<Message>('messageAdded');
  }


  reloadMessages(chatRoom: ChatRoom) {
    this.socket.emit('reload-messages', chatRoom);
  }


  getChatMembers(): Observable<User[]> {
    return this.socket.fromEvent<User[]>('chat-members');
  }
}

