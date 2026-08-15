import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { GuestLoginDto, RegisterDto, LoginDto, UpdateThemeDto, UpdateColorModeDto, UpdateProfileDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: any) {
    const { googleId, email, firstName, lastName, picture } = profile;
    
    // Check if user exists by googleId
    let user = await this.usersService.findByGoogleId(googleId);
    
    if (!user) {
      // Check if user exists by email
      user = await this.usersService.findByEmail(email);
      
      if (user) {
        // Link google account to existing user
        user.googleId = googleId;
        if (!user.avatar) user.avatar = picture;
        await user.save();
      } else {
        // Create new user
        const fullName = `${firstName} ${lastName}`.trim();
        const baseUsername = email.split('@')[0];
        // Ensure username uniqueness could be complex, simple fallback for now
        let username = baseUsername;
        let counter = 1;
        while (await this.usersService.findByUsername(username)) {
           username = `${baseUsername}${counter}`;
           counter++;
        }

        user = await this.usersService.create({
          username,
          email,
          googleId,
          fullName,
          avatar: picture,
          isGuest: false,
          role: 'user',
          theme: 'light',
          colorMode: 'blue',
        });
      }
    }
    
    return user;
  }

  async googleLogin(user: any) {
    const payload = { sub: user._id, username: user.username, isGuest: false };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: this.formatUser(user),
    };
  }

  private formatUser(user: any) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      isGuest: user.isGuest,
      theme: user.theme,
      colorMode: user.colorMode,
      role: user.role,
      fullName: user.fullName,
      title: user.title,
      avatar: user.avatar,
    };
  }

  async guestLogin(guestLoginDto: GuestLoginDto) {
    const guestUsername = guestLoginDto.username || `Guest_${uuidv4().slice(0, 8)}`;

    const user = await this.usersService.create({
      username: guestUsername,
      isGuest: true,
      role: 'guest',
      theme: 'light',
      colorMode: 'blue',
      fullName: 'Guest User',
    });

    const payload = { sub: user._id, username: user.username, isGuest: true };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: this.formatUser(user),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      username: registerDto.username,
      password: hashedPassword,
      email: registerDto.email,
      isGuest: false,
      role: 'user',
      theme: 'light',
      colorMode: 'blue',
    });

    const payload = { sub: user._id, username: user.username, isGuest: false };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: this.formatUser(user),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, username: user.username, isGuest: false };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: this.formatUser(user),
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.formatUser(user);
  }

  async updateTheme(userId: string, updateThemeDto: UpdateThemeDto) {
    const user = await this.usersService.updateTheme(userId, updateThemeDto.theme);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.formatUser(user);
  }

  async updateColorMode(userId: string, updateColorModeDto: UpdateColorModeDto) {
    const user = await this.usersService.updateColorMode(userId, updateColorModeDto.colorMode);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.formatUser(user);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(userId, updateProfileDto);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.formatUser(user);
  }
}
