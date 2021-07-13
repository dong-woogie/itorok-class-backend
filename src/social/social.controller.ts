import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SocialProvider } from 'src/users/entities/social-account.entity';
import { SocialRegisterInputType } from './dto/register.dto';
import { SocialService } from './social.service';
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('kakao')
  kakaoCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query() { code, state }: { code: string; state: SocialProvider },
  ): void {
    this.socialService.kakaoLogin(res, { code, state });
  }

  @Post('register')
  socialRegister(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SocialRegisterInputType,
  ) {
    this.socialService.socialRegister(req, res, body);
  }

  @Get('profile')
  getSocialProfile(@Req() req: Request, @Res() res: Response) {
    this.socialService.getSocialProfileWhenRegister(req, res);
  }

  // @Get()
  // facebookCallback() {}

  // @Get()
  // googleCallback() {}
}
