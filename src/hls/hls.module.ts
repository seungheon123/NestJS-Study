// src/hls/hls.module.ts
import { Module } from '@nestjs/common';
import { WebRtcGateway } from './webrtc.gateway';
import { SignalingGateway } from './signaling.gateway';

@Module({
  providers: [WebRtcGateway, SignalingGateway],
})
export class HlsModule {}
