import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveChatEntity } from '../model/active-chat.entity';
import { ActiveChat } from '../model/active-chat.model';
import { User } from 'src/user/model/user.model';
import { ChatRoom } from '../model/chat-room.model';

@Injectable()
export class ActiveChatService {

  constructor(
    @InjectRepository(ActiveChatEntity)
    private readonly joinedRoomRepository: Repository<ActiveChatEntity>
  ) { }

  async create(joinedRoom: ActiveChat): Promise<ActiveChat> { 
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async findByUser(user: User): Promise<ActiveChat[]> {
    return this.joinedRoomRepository.find({where:{ user }});
  }

  async findByRoom(chatRoom: ChatRoom): Promise<ActiveChat[]> {
    return this.joinedRoomRepository.find({where:{ chatRoom }});
  }

  async deleteBySocketId(socketId: string) {
    return this.joinedRoomRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }

}