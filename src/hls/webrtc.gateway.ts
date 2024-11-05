// src/webrtc/webrtc.gateway.ts
import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { RtpCapabilities, RtpParameters, WebRtcTransport } from 'mediasoup/node/lib/types';
import { HlsService } from '../hls/hls.service';
import { spawn } from "child_process";
import ffmpeg from "ffmpeg-static";
import { RtpCodecCapability } from "mediasoup/node/lib/RtpParameters";
import * as sdpTransform from 'sdp-transform';

@Injectable()
export class WebRtcGateway {
  private router: mediasoup.types.Router;
  private transport: WebRtcTransport;

  constructor(private readonly hlsService: HlsService) {
    this.initMediasoup();
  }

  private async initMediasoup() {
    const mediaCodecs: RtpCodecCapability[] = [
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {},
      },
      {
        kind: 'video',
        mimeType: 'video/VP9',
        clockRate: 90000,
        parameters: {},
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {},
      },
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
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

  // async handleOffer(offerSdp: string) {
  //   console.log(offerSdp);
  //   const peerConnection = new RTCPeerConnection({
  //     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  //   });
  //   await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offerSdp }));
  //   const answerSdp = await peerConnection.createAnswer();
  //   await peerConnection.setLocalDescription(answerSdp);
  //
  //   peerConnection.onicecandidate = (event) => {
  //     if(event.candidate) {
  //       console.log('New ICE candidate:', event.candidate);
  //     }
  //   };
  //   return answerSdp.sdp;
  // }

  public async handleOffer(offerSdp: string) {
    const transport = await this.createTransport();

    const sdpObject = sdpTransform.parse(offerSdp);
    const fingerprints = [];

    // SDP의 모든 미디어 섹션에서 fingerprint를 찾아서 배열에 추가
    for (const media of sdpObject.media) {
      if (media.fingerprint) {
        fingerprints.push({
          algorithm: media.fingerprint.type,
          value: media.fingerprint.hash,
        });
        break; // 첫 번째 fingerprint만 사용하고 나머지는 무시
      }
    }

    // WebRTC 연결을 위한 DTLS 파라미터 설정
    await transport.connect({ dtlsParameters: {
        role: "auto",
        fingerprints,
      } });

    const rtpParameters = this.extractRtpParametersFromSdp(offerSdp);

    // 클라이언트에서 받은 SDP로부터 RTP 파라미터를 추출
    // const rtpParameters = this.extractRtpParametersFromSdp(offerSdp);

    // transport.produce()에 ssrc 포함된 rtpParameters 사용
    const producer = await transport.produce({ kind: 'video', rtpParameters });

    // Return necessary details to the client
    return {
      id: producer.id,
      kind: producer.kind,
      transportId: transport.id,
    };
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

  private extractRtpParametersFromSdp(offerSdp: string): mediasoup.types.RtpParameters {
    const sdpObject = sdpTransform.parse(offerSdp);
    const videoMedia = sdpObject.media.find(media => media.type === 'video');

    if (!videoMedia) {
      throw new Error('No video media section found in the SDP');
    }

    // Extract codecs
    const codecs = videoMedia.rtp.map(codec => ({
      mimeType: `video/${codec.codec}`,
      payloadType: codec.payload,
      clockRate: codec.rate,
      channels: codec.encoding || 1,
      parameters: {}, // Add codec parameters if available
    }));

    // Extract encodings (using SSRC)
    const encodings = videoMedia.ssrcs
      ? [{ ssrc: parseInt(videoMedia.ssrcs[0].id, 10) }]
      : [];

    if (encodings.length === 0) {
      throw new Error('No SSRC found in the video media section');
    }

    return {
      codecs,
      encodings,
    };
  }
}


