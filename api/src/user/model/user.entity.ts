import { ChatRoomEntity } from 'src/chat/model/chat-room.entity';
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ConnectionEntity } from './connection.entity';
import { MessageEntity } from 'src/chat/model/message.entity';
import { ActiveChatEntity } from 'src/chat/model/active-chat.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() =>  ChatRoomEntity, chatRoom => chatRoom.users)
  chatRooms: ChatRoomEntity[];

  @OneToMany(() => ConnectionEntity, connection => connection.user)
  connections: ConnectionEntity[];  
  
  @OneToMany(() => ActiveChatEntity, joinedRoom => joinedRoom.chatRoom)
  joinedRooms: ActiveChatEntity[]

  @OneToMany(() => MessageEntity, message => message.user)
  messages: MessageEntity[]

}