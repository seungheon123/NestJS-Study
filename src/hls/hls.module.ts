// src/hls/hls.module.ts
import { Module } from '@nestjs/common';
import { HlsService } from './hls.service';
import { HlsController } from './hls.controller';
import { WebRtcGateway } from "./webrtc.gateway";

@Module({
  providers: [HlsService, WebRtcGateway],
  controllers: [HlsController],
})
export class HlsModule {}