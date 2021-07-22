import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { REFRESH_TOKEN } from 'src/common/constants';
import { ErrorMessage } from 'src/common/dtos/output.dto';
import { RefreshTokenType } from 'src/users/entities/auth-token.entity';

@Injectable()
export class ApiService {
  constructor(private readonly authService: AuthService) {}

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
}
