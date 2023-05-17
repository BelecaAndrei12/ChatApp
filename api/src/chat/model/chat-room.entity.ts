import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MessageEntity } from "./message.entity";
import { ActiveChatEntity } from "./active-chat.entity";

@Entity()
export class ChatRoomEntity {
    @PrimaryGeneratedColumn()    
    id: number;

    @Column()
    name: string;

    @Column({type: 'timestamp', default: () =>  'CURRENT_TIMESTAMP'})
    creationDate: Date;
    
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastUpdated: Date;

    @Column({nullable: true})
    encryptedSymmetricKey: string;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];

    @OneToMany(() => ActiveChatEntity, joinedRoom => joinedRoom.chatRoom)
    joinedUsers: ActiveChatEntity[];

    @OneToMany(() =>MessageEntity, message => message.chatRoom ) 
    messages: MessageEntity[];    
}
