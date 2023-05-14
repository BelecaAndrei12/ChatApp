import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit {

  chatRooms$: Observable<ChatRoom[]>;
  selectedChatRoom: ChatRoom | null = null;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatRooms$ = this.chatService.getChatRoomsForUser().pipe(
      map((rooms) => {
        this.selectedChatRoom = rooms[1];
        console.log(rooms)
        return rooms;
      })
    );
  }


  onCreateChatRoom() {
    this.router.navigate(['/private/create-chat-room']);
  }

  onSelectedChatRoom(chatRoom: ChatRoom) {
    this.selectedChatRoom = chatRoom;
  }
}
