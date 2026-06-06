import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/modules/database/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (exists) throw new ConflictException('Email already in use')

    const hashed = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
      },
    })

    const tokens = await this.generateTokens(user.id, user.email)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    const { password, refreshToken, ...result } = user
    return { user: result, ...tokens }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const tokens = await this.generateTokens(user.id, user.email)
    await this.saveRefreshToken(user.id, tokens.refreshToken)

    const { password, refreshToken, ...result } = user
    return { user: result, ...tokens }
  }

  async refresh(userId: number, email: string) {
    const tokens = await this.generateTokens(userId, email)
    await this.saveRefreshToken(userId, tokens.refreshToken)
    return tokens
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
  }

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
    ])

    return { accessToken, refreshToken }
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    })
  }
}
