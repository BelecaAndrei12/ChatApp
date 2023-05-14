import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { ChatService } from '../services/chat.service';

@Injectable()
export class ChatRoomsResolver implements Resolve<ChatRoom[]> {

  constructor(private chatService: ChatService) {}

  resolve(): Observable<ChatRoom[] | null>  {
    this.chatService.getChatRoomsForUser().subscribe((res) => console.log(res))
    return this.chatService.getChatRoomsForUser();
  }
}
