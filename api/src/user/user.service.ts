import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { Like, Repository } from 'typeorm';
import { User } from './model/user.model';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use!');
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const user = new UserEntity();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  async login(user: User): Promise<string> {
    const { email, password } = user;

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (!userExists) {
      throw new HttpException('User not found!',HttpStatus.BAD_REQUEST);
    }

    const passwordMatch = await this.authService.comparePasswords(password, userExists.password);
    if(passwordMatch) {
        const payload: User = await this.findUserById(userExists.id)
        return this.authService.generateJwt(payload)
    } else {
      throw new HttpException('Wrong credentials!',HttpStatus.UNAUTHORIZED);
    }
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({where:{ id }})
  }

  async findUserByName(username: string):Promise<User[]> {
    const searchedUsername = `%${username}%`;
    return this.userRepository.find({where: { username: Like(searchedUsername)}})
  }
}
