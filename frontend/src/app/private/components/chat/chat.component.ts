import { Component, Input, OnChanges, OnDestroy, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable, combineLatest } from 'rxjs';
import { first, map, startWith, take, tap } from 'rxjs/operators';
import { Message } from 'src/app/models/message.model';
import { ChatRoom } from 'src/app/models/chat-room.model';
import { AuthService } from 'src/app/public/services/auth.service';
import { SymmetricKeyService } from '../../services/symmetric-key.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeChatRoom: ChatRoom;
  @ViewChild('messageContainer') private messageContainer: ElementRef;

  messages$: Observable<Message[]>;
  messageContent: string = '';
  loggedUserId = this.authService.getLoggedUser().id;
  scrolledToBottom: boolean = true;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private symmetricKeyService: SymmetricKeyService,
  ) {}

  ngOnInit(): void {
    this.messages$ = combineLatest([
      this.chatService.getMessages(),
      this.chatService.getAddedMessage().pipe(startWith(null))
    ]).pipe(
      map(([messages, addedMessage]) => {
        if (addedMessage && addedMessage.chatRoom.id === this.activeChatRoom.id) {
          messages = [...messages, addedMessage];
        }
        return messages;
      }),
      tap(() => this.scrollToBottom()),
      tap(() => this.chatService.joinRoom(this.activeChatRoom))
    );
  }

  ngOnChanges(): void {
    if (this.activeChatRoom) {
      this.chatService.joinRoom(this.activeChatRoom);
      this.chatService.getChatMembers().pipe(
        first(),
        map((res) => this.activeChatRoom.users = res),
        tap(() => this.symmetricKeyService.decryptAndReconstructSymmetricKey(this.activeChatRoom))
       ).subscribe()
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
}
