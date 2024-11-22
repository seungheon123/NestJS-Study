// // src/webrtc/webrtc.gateway.ts
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as mediasoup from 'mediasoup';
// import {
//   Consumer,
//   Producer,
//   Router,
//   RtpCapabilities,
//   WebRtcTransport,
//   Worker,
// } from 'mediasoup/node/lib/types';
// import { v4 as uuidv4 } from 'uuid';
// import { InjectRedis } from '@nestjs-modules/ioredis';
// import Redis from 'ioredis';
//
// const RTP_CAPABILITIES = {
//   codecs: [
//     {
//       mimeType: 'audio/opus',
//       kind: 'audio',
//       clockRate: 48000,
//       channels: 2,
//     },
//     {
//       mimeType: 'video/VP8',
//       kind: 'video',
//       clockRate: 90000,
//     },
//   ],
//   headerExtensions: [],
//   fecMechanisms: [],
// };
//
// @Injectable()
// export class WebRtcGateway implements OnModuleInit {
//   private worker: Worker;
//   private routers = new Map<string, Router>();
//   private transports = new Map<string, WebRtcTransport[]>();
//   private producers = new Map<string, Producer[]>();
//   private consumers = new Map<string, Consumer[]>();
//   constructor(@InjectRedis() private readonly redis: Redis) {}
//
//   async onModuleInit() {
//     this.worker = await mediasoup.createWorker({
//       logLevel: 'debug',
//       logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
//     });
//   }
//
//   async getRtpCapabilities() {
//     return RTP_CAPABILITIES;
//   }
//
//   async createRouter() {
//     const router = await this.worker.createRouter({
//       mediaCodecs: [
//         {
//           kind: 'audio',
//           mimeType: 'audio/opus',
//           clockRate: 48000,
//           channels: 2,
//         },
//         {
//           kind: 'video',
//           mimeType: 'video/VP8',
//           clockRate: 90000,
//         },
//       ],
//     });
//     const roomId = uuidv4();
//     // this.redis.set(roomId, router.id);
//     this.routers.set(roomId, router);
//     return { router, roomId };
//   }
//
//   async createWebRtcTransport(router: Router): Promise<WebRtcTransport> {
//     // const router = await this.createRouter();
//     const transport = await router.createWebRtcTransport({
//       listenIps: [{ ip: '0.0.0.0', announcedIp: '127.0.0.1' }],
//       enableUdp: true,
//       enableTcp: true,
//       preferUdp: true,
//     });
//     await transport.setMaxIncomingBitrate(3500000);
//     await transport.setMaxOutgoingBitrate(2000000);
//
//     transport.on('routerclose', () => {
//       console.log('Router closed');
//     });
//     // this.transports.push(transport);
//     return transport;
//   }
//
//   async createProducer(
//     transportId: string,
//     kind: 'audio' | 'video',
//     rtpParameters: any,
//     roomId: string,
//   ): Promise<Producer> {
//     const router = this.routers.get(roomId);
//     if (!router) {
//       throw new Error('Router not found');
//     }
//     // const transport = await this.createWebRtcTransport(router);
//     const transport = this.transports.get(transportId)?.[0];
//     const producer = await transport.produce({
//       kind,
//       rtpParameters,
//     });
//     if (!this.producers.has(roomId)) {
//       this.producers.set(roomId, []);
//     }
//     this.producers.get(roomId)?.push(producer);
//     producer.on('transportclose', () => {
//       console.log(`${kind} producer's transport closed`);
//       this.removeProducer(producer, roomId);
//     });
//     return producer;
//   }
//
//   async createConsumer(
//     transportId: string,
//     roomId: string,
//     producerId: string,
//     rtpCapabilities: RtpCapabilities,
//   ): Promise<Consumer | null> {
//     const router = this.routers.get(roomId);
//     if (!router) {
//       throw new Error('Router not found');
//     }
//     const transport = this.transports.get(transportId)?.[0];
//     const producer = this.producers
//       .get(roomId)
//       ?.find((p) => p.id === producerId);
//     if (!producer) {
//       throw new Error('Producer not found');
//     }
//     if (!transport) {
//       throw new Error('Transport not found');
//     }
//     if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
//       throw new Error('Can not consume');
//     }
//     const consumer = await transport.consume({
//       producerId: producer.id,
//       rtpCapabilities,
//       paused: true, // 초기 상태에서는 Consumer를 pause 상태로 설정
//     });
//
//     // roomId별로 Consumer 저장
//     if (!this.consumers.has(roomId)) {
//       this.consumers.set(roomId, []);
//     }
//     this.consumers.get(roomId)?.push(consumer);
//
//     // transport가 닫히면 해당 consumer 삭제
//     consumer.on('transportclose', () => {
//       console.log(`Consumer's transport closed`);
//       this.removeConsumer(consumer, roomId);
//     });
//     return consumer;
//   }
//
//   // findTransport(transportId: string): WebRtcTransport {
//   //   return this.transports.find((t) => t.id === transportId);
//   // }
//   //
//   // async connectTransport(transportId: string, dtlsParameters: any) {
//   //   const transport = this.findTransport(transportId);
//   //   if (transport) {
//   //     await transport.connect({ dtlsParameters });
//   //   }
//   // }
//
//   private removeProducer(producer: Producer, roomId: string) {
//     const producersFromRoom = this.producers.get(roomId);
//     if (producersFromRoom) {
//       this.producers.set(
//         roomId,
//         producersFromRoom.filter((p) => p.id !== producer.id),
//       );
//       producer.close();
//     }
//   }
//
//   private removeConsumer(consumer: Consumer, roomId: string) {
//     const consumersFromRoom = this.consumers.get(roomId);
//     if (!consumersFromRoom) {
//       this.consumers.set(
//         roomId,
//         consumersFromRoom.filter((c) => c.id !== consumer.id),
//       );
//       consumer.close();
//     }
//   }
//
//   async startBroadcast() {
//     const { router, roomId } = await this.createRouter();
//     const transport = await this.createWebRtcTransport(router);
//     return { roomId, transport };
//   }
//
//   async watchBroadcast(roomId: string, sdp: RtpCapabilities) {
//     const router = this.routers.get(roomId);
//     if (!router) {
//       throw new Error('Router not found');
//     }
//     const producer = this.producers.get(roomId)?.[0];
//     router.canConsume({ producerId: producer.id, rtpCapabilities: sdp });
//     const consumer = await this.createConsumer(roomId, producer.id, sdp);
//     return consumer.rtpParameters;
//   }
// }
