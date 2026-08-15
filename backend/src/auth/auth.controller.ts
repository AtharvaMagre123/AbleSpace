import { Controller, Post, Body, Get, Patch, UseGuards, Request, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GuestLoginDto, RegisterDto, LoginDto, UpdateThemeDto, UpdateColorModeDto, UpdateProfileDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  async guestLogin(@Body() guestLoginDto: GuestLoginDto) {
    return this.authService.guestLogin(guestLoginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const { access_token, user } = await this.authService.googleLogin(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    // Redirect back to frontend with token and user data
    // Usually it's better to set a cookie or send just the token, but query params work for a simple setup.
    res.redirect(`${frontendUrl}/?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('theme')
  async updateTheme(@Request() req: any, @Body() updateThemeDto: UpdateThemeDto) {
    return this.authService.updateTheme(req.user.userId, updateThemeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('color-mode')
  async updateColorMode(@Request() req: any, @Body() updateColorModeDto: UpdateColorModeDto) {
    return this.authService.updateColorMode(req.user.userId, updateColorModeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.userId, updateProfileDto);
  }
}
