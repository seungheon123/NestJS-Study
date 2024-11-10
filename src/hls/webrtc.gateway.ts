// src/webrtc/webrtc.gateway.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import {
  Consumer,
  Producer,
  Router,
  RtpCapabilities,
  WebRtcTransport,
} from 'mediasoup/node/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class WebRtcGateway implements OnModuleInit {
  private worker: mediasoup.types.Worker;
  transports: WebRtcTransport[] = [];
  // router: mediasoup.types.Router: Map<string, Transport>;
  private routers: Map<string, Router>;
  private producers: Producer[] = [];
  private consumers: Consumer[] = [];
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async onModuleInit() {
    this.worker = await mediasoup.createWorker({
      logLevel: 'debug',
      logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
    });
  }

  async createRouter(): Promise<Router> {
    const router = await this.worker.createRouter({
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
        },
      ],
    });
    const roomId = uuidv4();
    this.redis.set(roomId, router.id);
    this.routers.set(roomId, router);
    return router;
  }

  async createWebRtcTransport(): Promise<WebRtcTransport> {
    const router = await this.createRouter();
    const transport = await router.createWebRtcTransport({
      listenIps: [{ ip: '0.0.0.0', announcedIp: '127.0.0.1' }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });
    await transport.setMaxIncomingBitrate(3500000);
    await transport.setMaxOutgoingBitrate(2000000);

    transport.on('routerclose', () => {
      console.log('Router closed');
    });
    this.transports.push(transport);
    return transport;
  }

  async createProducer(
    transport: WebRtcTransport,
    kind: 'audio' | 'video',
    rtpParameters: any,
  ): Promise<Producer> {
    const producer = await transport.produce({
      kind,
      rtpParameters,
    });
    this.producers.push(producer);
    producer.on('transportclose', () => {
      console.log(`${kind} producer's transport closed`);
      this.removeProducer(producer);
    });
    return producer;
  }

  async createConsumer(
    transport: WebRtcTransport,
    producerId: string,
    rtpCapabilities: RtpCapabilities,
  ): Promise<Consumer | null> {
    if (!this.router.canConsume({ producerId, rtpCapabilities })) {
      console.error('Can not consume');
      return null;
    }
    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: true,
    });
    this.consumers.push(consumer);
    consumer.on('transportclose', () => {
      console.log('Consumer transport closed');
      this.removeConsumer(consumer);
    });
    return consumer;
  }

  // getRtpCapabilities(): RtpCapabilities {
  //   return this.router.rtpCapabilities;
  // }

  findTransport(transportId: string): WebRtcTransport {
    return this.transports.find((t) => t.id === transportId);
  }

  async connectTransport(transportId: string, dtlsParameters: any) {
    const transport = this.findTransport(transportId);
    if (transport) {
      await transport.connect({ dtlsParameters });
    }
  }

  private removeProducer(producer: Producer) {
    this.producers = this.producers.filter((p) => p.id !== producer.id);
    producer.close();
  }

  private removeConsumer(consumer: Consumer) {
    this.consumers = this.consumers.filter((c) => c.id !== consumer.id);
    consumer.close();
  }
}
