import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/model/user.model';
import { UserService } from 'src/user/user.service';
import { ChatRoomService } from '../services/chat-room.service';
import { ChatRoom } from '../model/chat-room.model';
import { ConnectionService } from '../services/connection.service';
import { Connection } from 'src/user/model/connection.model';
import { MessageService } from '../services/message.service';
import { ActiveChatService } from '../services/active-chat.service';
import { Message } from '../model/message.model';
import { ActiveChat } from '../model/active-chat.model';

@WebSocketGateway({cors: {origin:['https://hoppscotch.io','http://localhost:3000','http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server:Server;

  testMessages: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chatRoomService: ChatRoomService,
    private connectionService: ConnectionService,
    private messageService: MessageService,
    private activeChatService: ActiveChatService,
  ) { }

  async onModuleInit() {
    await this.connectionService.deleteAll();
    await this.activeChatService.deleteAll();
  }

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

        await this.connectionService.addConnection({socketId: socket.id, user})
        return this.server.to(socket.id).emit('chat-rooms',chatRooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }
  
  async handleDisconnect(socket: Socket): Promise<void> {
      await this.connectionService.deleteConnectionBySocketId(socket.id);
      socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createChatRoom')
  async handleCreateChatRoom(socket, chatRoom: ChatRoom): Promise<ChatRoom>{
    try {
        const chatRoomm = await this.chatRoomService.createChatRoom(chatRoom,socket.data.user)

        for(const user of chatRoomm.users) {
          const connections: Connection[] =  await this.connectionService.findConnectionByUser(user)
          const rooms = await this.chatRoomService.getChatRoomsByUser(user)
          for (const connection of connections) {
            await this.server.to(connection.socketId).emit('chat-rooms',rooms)
          }
        }
        return this.chatRoomService.createChatRoom(chatRoom,socket.data.user)
    } catch {
      throw new UnauthorizedException();
    }
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, chatRoom: ChatRoom) {
    const messages = await this.messageService.getMessagesForRoom(chatRoom);

    await this.activeChatService.create({socketId: socket.id, user: socket.data.user,chatRoom})

    await this.server.to(socket.id).emit('messages',messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    await this.activeChatService.deleteBySocketId(socket.id)
  }

  @SubscribeMessage('addMessage') 
  async onAddMessage(socket: Socket, message: Message) {
    const createdMessage: Message = await this.messageService.create({...message, user: socket.data.user})
    const chatRoom: ChatRoom =  await this.chatRoomService.getChatRoomById(createdMessage.chatRoom.id)
    const joinedUsers: ActiveChat[] = await this.activeChatService.findByRoom(chatRoom)
    for(const user of joinedUsers) {
      console.log(user)
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }
}
