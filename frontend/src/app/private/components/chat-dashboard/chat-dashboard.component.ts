import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable, map } from 'rxjs';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit{

  chatRooms$: Observable<ChatRoom[]> = this.chatService.getChatRoomsForUser();

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit(): void {

  }

  onCreateChatRoom() {
    this.router.navigate(['/private/create-chat-room'])
  }
}
