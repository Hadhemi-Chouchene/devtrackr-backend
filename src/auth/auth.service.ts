import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // check if user exists
    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    await this.usersService.create(email, hashedPassword);

    return { message: 'User registered successfully' };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // check if user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // hash refresh token before saving
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    // save hashed refresh token in database
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      hashedRefreshToken,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshUserSession(refreshToken: string) {
    try {
      // verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // find user by id from payload
      const user = await this.usersService.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // check if refresh token exists in database
      if (!user.refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      // compare refresh token with hashed version in database
      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: JwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const accessToken = this.generateAccessToken(newPayload);
      const newRefreshToken = this.generateRefreshToken(newPayload);

      const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      await this.usersService.updateRefreshToken(
        user._id.toString(),
        hashedRefreshToken,
      );
      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Invalidate the refresh token by removing it from the database
    await this.usersService.updateRefreshToken(userId, '');
    return { message: 'Logged out successfully' };
  }

  // helper methods
  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }
}
