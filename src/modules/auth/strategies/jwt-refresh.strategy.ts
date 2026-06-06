import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/modules/database/prisma.service'
import { Request } from 'express'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: { sub: number; email: string }) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim()

    if (!refreshToken) throw new UnauthorizedException()

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user || !user.refreshToken) throw new UnauthorizedException()

    const { password, ...result } = user
    return { ...result, refreshToken }
  }
}
