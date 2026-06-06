import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

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
  refresh(@Body() body: { userId: number; email: string }) {
    return this.authService.refresh(body.userId, body.email)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Body() body: { userId: number }) {
    return this.authService.logout(body.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me() {
    return { message: 'You are authenticated' }
  }
}
