// src/hls/hls.controller.ts
import { Controller, Get, Param, Res, NotFoundException, Post, Body } from "@nestjs/common";
import { HlsService } from './hls.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { WebRtcGateway } from "./webrtc.gateway";

@Controller('hls')
export class HlsController {
  constructor(private readonly hlsService: HlsService, private readonly webRtcGateway: WebRtcGateway) {}

  @Get(':filename')
  async getHlsFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(this.hlsService.getHlsDirectory(), filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    res.sendFile(filePath);
  }

  @Post('start')
  async startWebRtc(@Body('sdp') sdp: string) {
    const answerSdp = await this.webRtcGateway.handleOffer(sdp);
    return { sdp: answerSdp };
  }
}