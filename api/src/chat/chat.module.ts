import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatRoomService } from './services/chat-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from './model/chat-room.entity';
import { ConnectionService } from './services/connection.service';
import { ConnectionEntity } from 'src/user/model/connection.entity';
import { MessageEntity } from './model/message.entity';
import { ActiveChatEntity } from './model/active-chat.entity';
import { ActiveChatService } from './services/active-chat.service';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    TypeOrmModule.forFeature([ChatRoomEntity,ConnectionEntity,MessageEntity,ActiveChatEntity]),
  ],
  providers: [
    ChatGateway,
    ChatRoomService,
    ConnectionService,
    ActiveChatService,
    MessageService,
  ]
})
export class ChatModule {}
