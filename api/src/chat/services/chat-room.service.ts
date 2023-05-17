import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomEntity } from '../model/chat-room.entity';
import { ChatRoom } from '../model/chat-room.model';
import { User } from 'src/user/model/user.model';
import { SymmetricKeyService } from 'src/encryption/symmetric-key.service';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private chatRoomRepository: Repository<ChatRoomEntity>,
    private symmetricKeyService: SymmetricKeyService,
  ) {}

  async createChatRoom(chatRoom: ChatRoom, createdBy: User): Promise<ChatRoom> {
     const room = await this.addCreatorToChatRoom(chatRoom,createdBy)
     const symmetricKey = this.symmetricKeyService.generateSymmetricKey();
     room.encryptedSymmetricKey =  this.symmetricKeyService.encryptSymmetricKey(room,symmetricKey)
     return this.chatRoomRepository.save(room)
  }

  async addCreatorToChatRoom(chatRoom: ChatRoom, createdBy: User): Promise<ChatRoom> {
    chatRoom.users.push(createdBy);
    return chatRoom 
  }


 
  async getChatRoomById(chatRoomId: number): Promise<ChatRoom> {
    return this.chatRoomRepository
      .createQueryBuilder("chatRoom")
      .leftJoinAndSelect("chatRoom.users", "users")
      .where("chatRoom.id = :chatRoomId", { chatRoomId })
      .getOne();
  }

  async getChatRoomsByUser(user: User): Promise<ChatRoomEntity[]> {
    return this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoin('chatRoom.users', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

  async getUsersByChatRoom(chatRoom: ChatRoom): Promise<User[]> {
    try {
      const room = await this.getChatRoomById(chatRoom.id);
      return room.users;
    } catch (error) {
      console.error('Error fetching users by chat room:', error);
      throw error;
    }
  }
}
