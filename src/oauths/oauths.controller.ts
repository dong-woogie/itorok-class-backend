import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import Axios from 'axios';
import qs from 'qs';

@Controller('oauths')
export class OauthsController {
  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const code = req.query?.code;

    if (!code) return res.redirect('http://localhost:3000/login');

    const { data } = await Axios({
      method: 'post',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: '8d957e615d6350869d5e1ba28defaf27',
        redirect_url: 'http://localhost:4000/oauths',
      },
    });

    const accessToken = data.access_token;

    const kakaoProfileData = await Axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    console.log(kakaoProfileData.data);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    res.redirect('http://localhost:3000');
  }
}
