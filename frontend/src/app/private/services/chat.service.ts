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

  leaveChatRoom(chatRoom: ChatRoom) {
    this.socket.emit('leaveChatRoom',chatRoom);
  }

  reloadChatRooms(chatRoom: ChatRoom) {
    this.socket.emit('reloadChatRooms', chatRoom)
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
  // getMessages(symmetricKey: Buffer): Observable<Message[]> {
  //   if(!symmetricKey){
  //     console.log('Symmetric key not received')
  //   }
  //   return this.socket.fromEvent<Message[]>('messages').pipe(
  //     map((messages) => {
  //       for (const message of messages) {
  //         message.content = this.symmetricKeyService.decryptMessage(symmetricKey, message.content);
  //       }
  //       return messages;
  //     })
  //   );
  // }

  // getAddedMessage(symmetricKey: Buffer): Observable<Message> {
  //   this.getMessages(symmetricKey);
  //   return this.socket.fromEvent<Message>('messageAdded').pipe(
  //     map((message) => {
  //       message.content = this.symmetricKeyService.decryptMessage(symmetricKey, message.content);
  //       return message;
  //     })
  //   );
  // }


  reloadMessages(chatRoom: ChatRoom) {
    this.socket.emit('reload-messages', chatRoom);
  }


  getChatMembers(): Observable<User[]> {
    return this.socket.fromEvent<User[]>('chat-members');
  }
}

