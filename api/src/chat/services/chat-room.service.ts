import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomEntity } from '../model/chat-room.entity';
import { ChatRoom } from '../model/chat-room.model';
import { User } from 'src/user/model/user.model';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private chatRoomRepository: Repository<ChatRoomEntity>,
  ) {}

  async createChatRoom(chatRoom: ChatRoom, createdBy: User): Promise<ChatRoom> {
     const room = await this.addCreatorToChatRoom(chatRoom,createdBy)
     return this.chatRoomRepository.save(room)
  }

  async addCreatorToChatRoom(chatRoom: ChatRoom, createdBy: User): Promise<ChatRoom> {
    chatRoom.users.push(createdBy);
    return chatRoom 
  }

  async getChatRoomsByUser(user: User): Promise<ChatRoomEntity[]> {
    return this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoin('chatRoom.users', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

}
