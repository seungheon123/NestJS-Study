import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import { InjectRedis } from '@nestjs-modules/ioredis';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(@InjectRedis() private readonly redis: Redis) {}

  @SubscribeMessage('makeChatroom')
  async handleMakeChatroom(@ConnectedSocket() client: Socket) {
    const chatRoomId = uuid();
    await this.redis.sadd(chatRoomId, client.id); // 방에 현재 클라이언트 추가

    client.join(chatRoomId);
    return chatRoomId;
  }

  @SubscribeMessage('joinChatroom')
  async handleJoinChatroom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId); // 방에 입장
    await this.redis.sadd(roomId, client.id);
    const usersInRoom = await this.redis.smembers(roomId);
    this.server.to(roomId).emit('userJoined', {
      userId: client.id,
      roomId: roomId,
      members: usersInRoom, // 현재 방에 있는 사용자 전체 목록
    });
  }
}
