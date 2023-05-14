import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoomEntity } from "./chat-room.entity";

@Entity()
export class ActiveChatEntity {

   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   socketId: string;

   @ManyToOne(() => UserEntity, user => user.joinedRooms)
   @JoinColumn()
   user: UserEntity;

   @ManyToOne(() => ChatRoomEntity, chatRoom => chatRoom.joinedUsers)
   @JoinColumn()
   chatRoom: ChatRoomEntity;
}