import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { REDIRECT_URI } from 'src/common/constants';
import { UserRole } from 'src/users/entities/user.entity';
import { ApiService } from './api.service';
import { SendCodeInput, VerifyCodeInput } from './dtos/api.dto';

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
