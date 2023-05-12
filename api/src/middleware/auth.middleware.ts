import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/model/user.model';
import { UserService } from 'src/user/user.service';

export interface RequestModel extends Request {
    user: User
  }

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try{
        const token: string[] = req.headers['authorization'].split(' ');
        console.log(token)
        const userData  = await this.authService.verifyJwt(token[1])
        const user: User = await this.userService.findUserById(userData.user.id);
        if(user) {
            req.user = user;
            next();
        } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    } catch {
        throw new HttpException("Unauthorized",HttpStatus.UNAUTHORIZED)
    }
  }
}
