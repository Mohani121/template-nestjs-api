import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    const user = req.user as any
    return this.authService.refresh(user.id, user.email)
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    const user = req.user as any
    return this.authService.logout(user.id)
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user
  }
}
