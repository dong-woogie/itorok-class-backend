import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import {
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  BUCKET_NAME,
  CALLER_NUMBER,
  NAVER_API_ACCESS_KEY,
  NAVER_API_SECRET_KEY,
  NAVER_API_SERVICE_ID,
  NAVER_MESSAGE_API_URL,
  REFRESH_TOKEN,
} from 'src/common/constants';
import { ErrorMessage } from 'src/common/dtos/output.dto';
import { RefreshTokenType } from 'src/users/entities/auth-token.entity';
import * as crypto from 'crypto';
import { SendCodeInput, VerifyCodeInput } from './dtos/api.dto';
import { Cache } from 'cache-manager';
import * as AWS from 'aws-sdk';

@Injectable()
export class ApiService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAccessToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN];
      if (!refreshToken) throw new Error(ErrorMessage.NOT_FOUND_REGISTER_TOKEN);

      const decoded = await this.authService.decodedToken<RefreshTokenType>(
        refreshToken,
      );

      const now = new Date().getTime();
      const diff = decoded.exp * 1000 - now;
      if (diff < 0) throw new Error(ErrorMessage.EXPIRED_REFRESH_TOKEN);

      const accessToken = await this.authService.generateToken(
        { id: decoded.userId },
        { expiresIn: '1h' },
      );
      return res.json({ ok: true, accessToken });
    } catch (e) {
      res.json({ ok: false, error: e?.message });
    }
  }

  private makeSignature() {
    const message = [];
    const method = 'POST';
    const space = ' ';
    const newline = '\n';
    const timestamp = Date.now().toString();
    const hmac = crypto.createHmac(
      'sha256',
      this.configService.get(NAVER_API_SECRET_KEY),
    );
    const url = `/sms/v2/services/${this.configService.get(
      NAVER_API_SERVICE_ID,
    )}/messages`;

    message.push(method);
    message.push(space);
    message.push(url);
    message.push(newline);
    message.push(timestamp);
    message.push(newline);
    message.push(this.configService.get(NAVER_API_ACCESS_KEY));

    const signature = hmac.update(message.join('')).digest('base64');
    return signature.toString();
  }

  async verificationData(phoneNumber: string) {
    const verificationNumber = Array.from({ length: 4 })
      .map(() => Math.floor(Math.random() * 10))
      .join('');

    const content = `ITORK-CALSS: 인증번호는 [${verificationNumber}]입니다.`;

    await this.cacheManager.del(phoneNumber);
    await this.cacheManager.set(phoneNumber, verificationNumber, {
      ttl: 60 * 3,
    });

    return {
      content,
      phoneNumber,
      verificationNumber,
    };
  }

  async sendVerificationCode(
    req: Request,
    res: Response,
    { phoneNumber }: SendCodeInput,
  ) {
    try {
      const messageData = await this.verificationData(phoneNumber);
      const body = {
        content: messageData.content,
        contentType: 'COMM',
        countryCode: '82',
        from: this.configService.get(CALLER_NUMBER),
        messages: [{ to: phoneNumber }],
        subject: '',
        type: 'sms',
      };
      const options = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-ncp-iam-access-key': this.configService.get(NAVER_API_ACCESS_KEY),
          'x-ncp-apigw-timestamp': Date.now().toString(),
          'x-ncp-apigw-signature-v2': this.makeSignature(),
        },
      };
      const { data } = await axios.post(
        this.configService.get(NAVER_MESSAGE_API_URL),
        body,
        options,
      );

      if (data.statusCode === '202') return res.json({ ok: true });
      res.json({ ok: false });
    } catch (e) {
      res.json({ ok: false });
    }
  }

  async verifyCode(
    req: Request,
    res: Response,
    { code, phoneNumber }: VerifyCodeInput,
  ) {
    try {
      const value = await this.cacheManager.get(phoneNumber);

      if (!value) throw new Error(ErrorMessage.PLEASE_TRY_AGAIN);
      if (value !== code) throw new Error(ErrorMessage.PLEASE_TRY_AGAIN);

      await this.cacheManager.del(phoneNumber);

      res.json({ ok: true });
    } catch (e) {
      res.json({
        ok: false,
        error: e?.message || ErrorMessage.PLEASE_TRY_AGAIN,
      });
    }
  }

  getS3() {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configService.get(AWS_ACCESS_KEY),
        secretAccessKey: this.configService.get(AWS_SECRET_KEY),
      },
    });

    return new AWS.S3({ region: 'ap-northeast-2' });
  }

  getObjectName(filename: string) {
    return `original/${+new Date()}_${filename}`;
  }

  getS3Url(bucketName: string, objectname: string) {
    return `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${objectname}`;
  }

  async uploads(res: Response, files: Array<Express.Multer.File>) {
    try {
      const bucketName = this.configService.get(BUCKET_NAME);
      const s3 = this.getS3();
      const images = await Promise.all(
        files.map(async (file) => {
          const objectname = this.getObjectName(file.originalname);
          await s3
            .putObject({
              Body: file.buffer,
              ACL: 'public-read',
              Bucket: bucketName,
              Key: objectname,
            })
            .promise();

          const url = this.getS3Url(bucketName, objectname);
          return url;
        }),
      );

      res.json({ ok: true, images });
    } catch {
      res.json({ ok: false, images: [] });
    }
  }

  async upload(res: Response, file: Express.Multer.File) {
    try {
      const bucketName = this.configService.get(BUCKET_NAME);
      const s3 = this.getS3();

      const objectname = this.getObjectName(file.originalname);
      await s3
        .putObject({
          Body: file.buffer,
          ACL: 'public-read',
          Bucket: bucketName,
          Key: objectname,
        })
        .promise();
      const image = this.getS3Url(bucketName, objectname);

      res.json({ ok: true, image });
    } catch {
      res.json({ ok: false });
    }
  }
}
