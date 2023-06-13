import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, first, tap } from 'rxjs';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { ChatService } from '../services/chat.service';

@Injectable({providedIn: 'root'})
export class ChatRoomsResolver implements Resolve<ChatRoom[]> {

  constructor(private chatService: ChatService) {}

  resolve(): Observable<ChatRoom[]>  {
    this.chatService.getChatRoomsForUser().subscribe((res) => console.log(res))
    return this.chatService.getChatRoomsForUser().pipe(first())
  }
}
