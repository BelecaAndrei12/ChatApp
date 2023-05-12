import { UserEntity } from "src/user/model/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];
}
