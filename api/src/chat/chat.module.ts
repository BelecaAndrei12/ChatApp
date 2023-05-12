import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatRoomService } from './services/chat-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from './model/chat-room.entity';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    TypeOrmModule.forFeature([ChatRoomEntity]),
  ],
  providers: [
    ChatGateway,
    ChatRoomService
  ]
})
export class ChatModule {}
