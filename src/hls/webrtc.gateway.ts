// src/webrtc/webrtc.gateway.ts
import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { RtpCapabilities, RtpParameters, WebRtcTransport } from 'mediasoup/node/lib/types';
import { HlsService } from '../hls/hls.service';
import { spawn } from "child_process";
import ffmpeg from "ffmpeg-static";
import { RtpCodecCapability } from "mediasoup/node/lib/RtpParameters";

@Injectable()
export class WebRtcGateway {
  private router: mediasoup.types.Router;
  private transport: WebRtcTransport;

  constructor(private readonly hlsService: HlsService) {
    this.initMediasoup();
  }

  private async initMediasoup() {
    const mediaCodecs: RtpCodecCapability[] =
      [
        {
          kind        : "audio",
          mimeType    : "audio/opus",
          clockRate   : 48000,
          channels    : 2
        },
        {
          kind       : "video",
          mimeType   : "video/H264",
          clockRate  : 90000,
          parameters :
            {
              "packetization-mode"      : 1,
              "profile-level-id"        : "42e01f",
              "level-asymmetry-allowed" : 1
            }
        }
      ];

    const worker = await mediasoup.createWorker();
    this.router = await worker.createRouter({ mediaCodecs });

    console.log('Mediasoup Worker and Router initialized');
  }



  private async createTransport() {
    this.transport = await this.router.createWebRtcTransport({
      listenIps: [{ ip: '0.0.0.0', announcedIp: null}],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });
    return this.transport;
  }

  async handleOffer(offerSdp: string) {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offerSdp }));
    const answerSdp = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerSdp);

    peerConnection.onicecandidate = (event) => {
      if(event.candidate) {
        console.log('New ICE candidate:', event.candidate);
      }
    };
    return answerSdp.sdp;
  }

  // public async handleOffer(offerSdp: string) {
  //   const transport = await this.createTransport();
  //
  //   // WebRTC 연결을 위한 DTLS 파라미터 설정
  //   await transport.connect({ dtlsParameters: {
  //       role: "auto",
  //       fingerprints: []
  //     } });
  //
  //   // 클라이언트에서 받은 SDP로부터 RTP 파라미터를 추출
  //   const rtpParameters = this.extractRtpParametersFromSdp(offerSdp);
  //
  //   // transport.produce()에 ssrc 포함된 rtpParameters 사용
  //   const producer = await transport.produce({ kind: 'video', rtpParameters });
  //
  //   console.log('Producer created with id:', producer.id);
  //
  //   // Return necessary details to the client
  //   return transport;
  // }

  private extractRtpParametersFromSdp(sdp: string) {
    // 이 함수에서 SDP를 파싱하여 필요한 ssrc, mid 등의 정보를 추출하는 로직이 필요합니다.
    const rtpParameters: RtpParameters = {
      codecs: [
        {
          mimeType: 'video/VP8',
          payloadType: 101,
          clockRate: 90000,
        },
      ],
      encodings: [
        {
          ssrc: 12345678, // 실제로는 SDP에서 ssrc를 파싱하여 설정해야 합니다.
        },
      ],
    };
    return rtpParameters;
  }

  private saveStreamToDisk(producer) {
    // FFmpeg를 사용하여 WebRTC 스트림을 파일로 저장
    const ffmpegProcess = spawn(ffmpeg, [
      '-i', 'pipe:0', // 표준 입력으로 스트림 받기
      '-c:v', 'copy', // 비디오 인코딩 설정
      '-c:a', 'copy', // 오디오 인코딩 설정
      '-f', 'mp4', // 출력 형식을 mp4로 지정
      './output/broadcast.mp4',
    ]);

    // Producer에서 RTP 패킷을 읽고 FFmpeg에 전달
    producer.on('rtp', (packet) => {
      ffmpegProcess.stdin.write(packet.payload);
    });

    ffmpegProcess.stdout.on('data', (data) => console.log(`FFmpeg stdout: ${data}`));
    ffmpegProcess.stderr.on('data', (data) => console.error(`FFmpeg stderr: ${data}`));

    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
    });
  }
}