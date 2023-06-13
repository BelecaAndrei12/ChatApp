import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable, of } from 'rxjs';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/public/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit, OnChanges, AfterViewInit {

  chatRooms$: Observable<ChatRoom[]> | null;
  selectedChatRoom: ChatRoom | null = null;
  lastMessage!:Message;
  loggedUser = this.authService.getLoggedUser().username;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.reloadChatRooms()
    this.chatRooms$ = this.chatService.getChatRoomsForUser().pipe(
      map((rooms) => {
        rooms.sort((a , b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        return rooms;
      }),
      tap((rooms) => (console.log(rooms))),
      tap((rooms) =>  this.selectedChatRoom = rooms[0]),
    );

  }

  ngAfterViewInit(): void {
    //this.reloadChatRooms()
  }

  // ngOnInit(): void {
  //   this.route.data.subscribe(({ chatRooms }) => console.log(chatRooms))
  // }

  // private sortAndSetSelectedChatRoom(rooms: ChatRoom[]): Observable<ChatRoom[]> {
  //   rooms.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  //   this.selectedChatRoom = rooms[0];
  //   return of(rooms);
  // }

  ngOnChanges(): void {
    this.chatRooms$ = this.chatService.getChatRoomsForUser().pipe(
      map((rooms) => {
        this.selectedChatRoom = rooms[1];
        console.log(rooms)
        return rooms;
      }),
      tap(() =>  this.selectedChatRoom =  null),
      tap(() => this.chatService.reloadChatRooms(this.selectedChatRoom))
    );
  }


  onCreateChatRoom() {
    this.router.navigate(['/private/create-chat-room']);
  }

  onSelectedChatRoom(chatRoom: ChatRoom) {
    this.selectedChatRoom = chatRoom;
  }

  handleLastMessage(message: Message) {
    this.lastMessage = message
  }

  reloadChatRooms() {
    setTimeout(() => {
      const user =  this.authService.getLoggedUser()
      this.chatService.reloadChatRooms(user)
    }, 500);
  }

  logout() {
    this.router.navigate(['/public/welcome'])
    localStorage.clear()
    }

  userProfileNavigation() {
    this.router.navigate(['/private/user-profile'])
  }
}
