import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/model/user.model';
import { UserService } from 'src/user/user.service';
import { ChatRoomService } from '../services/chat-room.service';
import { ChatRoom } from '../model/chat-room.model';

@WebSocketGateway({cors: {origin:['https://hoppscotch.io','http://localhost:3000','http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server:Server;

  testMessages: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chatRoomService: ChatRoomService,
  ) { }

  async handleConnection(socket: Socket) {

    try {
      const userData = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      console.log(userData);
      const user: User = await this.userService.findUserById(userData.user.id);
      if(!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const chatRooms = await this.chatRoomService.getChatRoomsByUser(user);
        return this.server.to(socket.id).emit('chat-rooms',chatRooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }
  
  handleDisconnect(socket: Socket):void {
      console.log('Disconnect')
      socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createChatRoom')
  async handleCreateChatRoom(socket, chatRoom: ChatRoom): Promise<ChatRoom>{
    try {
        return this.chatRoomService.createChatRoom(chatRoom,socket.data.user)
    } catch {
      throw new UnauthorizedException();
    }
  }
}
