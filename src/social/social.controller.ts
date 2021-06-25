import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('social')
export class SocialController {
  @Get('kakao')
  kakaoCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;
    if (!code) return res.redirect(`http://localhost:3000/login`);
    res.redirect(`http://localhost:3000/social?code=${code}&provider=kakao`);
  }

  // @Get()
  // facebookCallback() {}

  // @Get()
  // googleCallback() {}
}
