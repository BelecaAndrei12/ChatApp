import { ChatRoomEntity } from "src/chat/model/chat-room.entity";
import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConnectionEntity {

  @PrimaryGeneratedColumn()
  connectionId: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, user => user.joinedRooms)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => ChatRoomEntity, room => room.joinedUsers)
  @JoinColumn()
  chatRoom: ChatRoomEntity;

}