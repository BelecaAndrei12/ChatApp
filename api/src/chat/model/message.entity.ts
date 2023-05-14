import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoomEntity } from "./chat-room.entity";

@Entity()
export  class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({type: 'timestamp', default: () =>  'CURRENT_TIMESTAMP'})
    created: Date;

    @ManyToOne(() => ChatRoomEntity, chatRoom => chatRoom.messages)
    @JoinTable()
    chatRoom: ChatRoomEntity;

    @ManyToOne(() => UserEntity, user => user.messages)
    @JoinTable()
    user: UserEntity;

} 