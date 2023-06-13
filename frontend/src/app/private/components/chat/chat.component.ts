import { Component, Input, OnChanges, OnDestroy, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable, combineLatest, of } from 'rxjs';
import { delay, map, startWith, tap } from 'rxjs/operators';
import { Message } from 'src/app/models/message.model';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { AuthService } from 'src/app/public/services/auth.service';
import { SymmetricKeyService } from '../../services/symmetric-key.service';
import { MatDialog } from '@angular/material/dialog';
import { InviteUsersComponent } from '../invite-users/invite-users.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeChatRoom: ChatRoom;
  @Output() lastMessage: EventEmitter<Message> = new EventEmitter<Message>();
  @ViewChild('messageContainer') private messageContainer: ElementRef;

  messages$: Observable<Message[]>;
  messageContent: string = '';
  loggedUserId = this.authService.getLoggedUser().id;
  scrolledToBottom: boolean = true;
  symmetricKey:Buffer;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private symmetricKeyService: SymmetricKeyService,
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.chatService.getChatMembers().subscribe((res) => this.activeChatRoom.users = res)
  }



  ngOnChanges(): void {
    if (this.activeChatRoom) {
      this.symmetricKey =  this.symmetricKeyService.decryptSymmetricKey(this.activeChatRoom)
      this.chatService.joinRoom(this.activeChatRoom)
      this.messages$ = combineLatest([
        this.chatService.getMessages(),
        this.chatService.getAddedMessage().pipe(startWith(null)),
      ]).pipe(
        map(([messages, addedMessage]) => {
          if (addedMessage && addedMessage.chatRoom.id === this.activeChatRoom.id) {
            messages = [...messages, addedMessage];
          }
          //console.log(messages)
          messages = messages.map(message => ({
            ...message,
            content: this.symmetricKeyService.decryptMessage(this.symmetricKey, message.content)
          }));
          return messages;
        }),
        tap(() =>  of(null).pipe(delay(500)).subscribe(() => {
          this.chatService.reloadMessages(this.activeChatRoom);
        })),
        tap(() => this.scrollToBottom()),
        //tap(() => console.log(this.symmetricKey)),
        //tap(() => console.log(JSON.parse(this.activeChatRoom.encryptedSymmetricKey)))
      );
    }
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.activeChatRoom);
  }

  onSendMessage(): void {
    if (this.messageContent) {
      const message: Message = {
        content: this.messageContent,
        chatRoom: this.activeChatRoom
      };
      this.chatService.sendMessage(this.symmetricKey, message);
      this.messageContent = '';
    }
  }

  onScroll(): void {
    const container = this.messageContainer.nativeElement;
    const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1;
    this.scrolledToBottom = isScrolledToBottom;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrolledToBottom) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    });
  }


  leaveChatRoom() {
    const loggedUser = this.authService.getLoggedUser();
    console.log(typeof(this.activeChatRoom.users[0].id))
    this.activeChatRoom.users = this.activeChatRoom.users.filter((user) => user.username !== loggedUser.username)
    this.activeChatRoom.encryptedSymmetricKey = this.symmetricKeyService.removeUserKeyOnLeave(loggedUser.id,JSON.parse(this.activeChatRoom.encryptedSymmetricKey))
    console.log(this.activeChatRoom)
    this.chatService.leaveChatRoom(this.activeChatRoom,loggedUser);
    window.location.reload();
   }

   openInviteUsersDialog(): void {
    this.matDialog.open(InviteUsersComponent, {
      width: '400px',
      disableClose: true,
      data: {
        activeChatroom: this.activeChatRoom,
        symmetricKey: this.symmetricKey,
      }
    });
  }

}
