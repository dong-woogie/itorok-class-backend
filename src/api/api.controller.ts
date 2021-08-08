import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { REDIRECT_URI } from 'src/common/constants';
import { UserRole } from 'src/users/entities/user.entity';
import { ApiService } from './api.service';
import { SendCodeInput, VerifyCodeInput } from './dtos/api.dto';
import * as AWS from 'aws-sdk';

@Controller('api')
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly configService: ConfigService,
  ) {}
  @Get('refresh')
  getAccessToken(@Req() req: Request, @Res() res: Response) {
    this.apiService.getAccessToken(req, res);
  }

  @Get('social/callback')
  socialCallback(
    @Res() res: Response,
    @Query() query: { code: string; state: UserRole },
  ) {
    res.redirect(
      this.configService.get(REDIRECT_URI) +
        `/social/login?code=${query.code}&role=${query.state}&provider=kakao`,
    );
  }

  @Post('send-code')
  sendVerificationCode(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SendCodeInput,
  ) {
    this.apiService.sendVerificationCode(req, res, body);
  }

  @Post('verify-code')
  verifyCode(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: VerifyCodeInput,
  ) {
    this.apiService.verifyCode(req, res, body);
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  uploads(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    this.apiService.uploads(res, files);
  }
}
