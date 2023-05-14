import { Component, Input, OnChanges, OnDestroy, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { Message } from 'src/app/models/message.model';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { AuthService } from 'src/app/public/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeChatRoom: ChatRoom;
  @ViewChild('messageContainer') private messageContainer: ElementRef

  messages$: Observable<Message[]>;
  messageContent: string = '';
  loggedUserId = this.authService.getLoggedUser().id;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(){
    this.messages$ = this.chatService.getMessages().pipe(
      tap(() => this.scrollToBottom())
    );
    return this.chatService.getAddedMessage().subscribe((addedMessage) => {
      if (addedMessage && addedMessage.chatRoom.id === this.activeChatRoom.id) {
       return  this.messages$ = this.messages$.pipe(
          map((messages) => [...messages, addedMessage])
        );
      } else {
        return null
      }
    });
  }

  ngOnChanges(): void {
    if (this.activeChatRoom) {
      this.chatService.joinRoom(this.activeChatRoom);
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
      this.chatService.sendMessage(message);
      this.messageContent = '';
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    });
  }
}
