import { ChatRoomEntity } from 'src/chat/model/chat-room.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}