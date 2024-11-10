import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { WebRtcGateway } from './webrtc.gateway';
import { Server, Socket } from 'socket.io';
import { RtpCapabilities } from 'mediasoup/node/lib/types';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@WebSocketGateway()
export class SignalingGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly webRtcGateway: WebRtcGateway,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @SubscribeMessage('getRtpCapabilities')
  async handleGetRtpCapabilities(client: Socket) {
    console.log('getRtpCapabilities');
    await this.redis.set('key', 'Redis data!');
    const rtpCapabilities = this.webRtcGateway.getRtpCapabilities();
    client.emit('rtpCapabilities', rtpCapabilities); // 클라이언트에 rtpCapabilities 전송
  }

  @SubscribeMessage('createTransport')
  async handleCreateTransport(@MessageBody() data: any, client: Socket) {
    const transport = await this.webRtcGateway.createWebRtcTransport();
    client.emit('transportCreated', {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    });
  }

  @SubscribeMessage('connectTransport')
  async handleConnectTransport(
    client: Socket,
    payload: { transportId: string; dtlsParameters: any },
  ) {
    await this.webRtcGateway.connectTransport(
      payload.transportId,
      payload.dtlsParameters,
    );
    client.emit('transportConnected', { transportId: payload.transportId });
  }

  @SubscribeMessage('produce')
  async handleProduce(
    client: Socket,
    payload: {
      transportId: string;
      kind: 'audio' | 'video';
      rtpParameters: any;
    },
  ) {
    const transport = this.webRtcGateway.findTransport(payload.transportId);
    if (transport) {
      const producer = await this.webRtcGateway.createProducer(
        transport,
        payload.kind,
        payload.rtpParameters,
      );
      client.emit('producerCreated', { producerId: producer.id });
    }
  }

  @SubscribeMessage('consume')
  async handleConsume(
    client: Socket,
    payload: {
      transportId: string;
      producerId: string;
      rtpCapabilities: RtpCapabilities;
    },
  ) {
    const transport = this.webRtcGateway.transports.find(
      (t) => t.id === payload.transportId,
    );
    if (transport) {
      const consumer = await this.webRtcGateway.createConsumer(
        transport,
        payload.producerId,
        payload.rtpCapabilities,
      );
      if (consumer) {
        client.emit('consumerCreated', {
          id: consumer.id,
          producerId: consumer.producerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        });
      }
    }
  }
}
