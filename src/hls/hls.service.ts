// // src/hls/hls.service.ts
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as mediasoup from 'mediasoup';
// import ffmpeg from 'ffmpeg-static';
// import { spawn } from 'child_process';
// import * as fs from 'fs';
// import * as path from 'path';
// import { RtpCodecCapability } from "mediasoup/node/lib/RtpParameters";
// import { WebRtcTransport } from "mediasoup/node/lib/WebRtcTransport";
//
// @Injectable()
// export class HlsService implements OnModuleInit {
//   private hlsDirectory = path.join(__dirname, '..', '..', 'hls');
//   private router: mediasoup.types.Router;
//   private transport: WebRtcTransport;
//
//   async onModuleInit() {
//     await this.initMediasoup();
//   }
//
//   private async initMediasoup() {
//     const mediaCodecs: RtpCodecCapability[] = [
//       {
//         kind: 'video',
//         mimeType: 'video/VP8',
//         clockRate: 90000,
//         parameters: {},
//       },
//       {
//         kind: 'audio',
//         mimeType: 'audio/opus',
//         clockRate: 48000,
//         channels: 2,
//       },
//     ];
//     const worker = await mediasoup.createWorker();
//     this.router = await worker.createRouter({ mediaCodecs });
//
//     console.log('Mediasoup Worker and Router initialized');
//   }
//
//   public startHLSStream(inputStream: NodeJS.ReadableStream) {
//     if (!fs.existsSync(this.hlsDirectory)) {
//       fs.mkdirSync(this.hlsDirectory, { recursive: true });
//     }
//
//     const ffmpegProcess = spawn(ffmpeg, [
//       '-i', 'pipe:0', // FFmpeg 표준 입력
//       '-c:v', 'libx264',
//       '-preset', 'veryfast',
//       '-c:a', 'aac',
//       '-f', 'hls', // HLS 포맷 설정
//       '-hls_time', '4',
//       '-hls_playlist_type', 'event',
//       '-hls_segment_filename', path.join(this.hlsDirectory, 'segment_%03d.ts'),
//       path.join(this.hlsDirectory, 'playlist.m3u8'),
//     ]);
//
//     inputStream.pipe(ffmpegProcess.stdin);
//
//     ffmpegProcess.stdout.on('data', (data) => console.log(`FFmpeg stdout: ${data}`));
//     ffmpegProcess.stderr.on('data', (data) => console.error(`FFmpeg stderr: ${data}`));
//
//     ffmpegProcess.on('close', (code) => {
//       console.log(`FFmpeg process exited with code ${code}`);
//     });
//   }
//
//   public getHlsDirectory() {
//     return this.hlsDirectory;
//   }
//
//
// }
