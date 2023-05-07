import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './model/dtos/create-user.dto';
import { LoginUserDto } from './model/dtos/login-user.dto';
import { User } from './model/user.model';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const { username, email, password } = createUserDto;
      const user = await this.userService.createUser(username, email, password);
      return { user };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const jwt = await this.userService.login(loginUserDto);
      return {
        message: jwt,
        token_type:'JWT',
        expires_in: 10000
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }
}
