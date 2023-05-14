import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectionEntity } from 'src/user/model/connection.entity';
import { Connection } from 'src/user/model/connection.model';
import { User } from 'src/user/model/user.model';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(ConnectionEntity)
    private readonly connectedUserRepository: Repository<ConnectionEntity>,
  ) {}

  async addConnection(connection: Connection): Promise<Connection> {
    return this.connectedUserRepository.save(connection);
  }

  async findConnectionByUser(user: User): Promise<Connection[]> {
    return this.connectedUserRepository.find({ where: { user } });
  }

  async deleteConnectionBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId })
  }

  async deleteAll() {
    await this.connectedUserRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }
}
