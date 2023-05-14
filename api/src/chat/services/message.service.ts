import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "../model/message.entity";
import { Repository } from "typeorm";
import { Message } from "../model/message.model";
import { ChatRoom } from "../model/chat-room.model";

@Injectable()
export class MessageService {


  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>
  ) {}

  async create(message: Message): Promise<Message> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async getMessagesForRoom(chatRoom: ChatRoom): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.chatRoom", "chatRoom")
      .where("chatRoom.id = :chatRoomId", { chatRoomId: chatRoom.id })
      .leftJoinAndSelect('message.user','user')
      .orderBy('message.created','ASC')
      .getMany();
  }
}