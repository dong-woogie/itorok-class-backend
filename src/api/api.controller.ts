import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { REDIRECT_URI } from 'src/common/constants';
import { SocialProvider } from 'src/users/entities/social-account.entity';
import { ApiService } from './api.service';

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
    @Query() { code, state }: { code: string; state: SocialProvider },
  ) {
    res.redirect(
      this.configService.get(REDIRECT_URI) +
        `/social/login?code=${code}&state=${state}`,
    );
  }
}
