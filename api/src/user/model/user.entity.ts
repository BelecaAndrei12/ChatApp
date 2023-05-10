import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}