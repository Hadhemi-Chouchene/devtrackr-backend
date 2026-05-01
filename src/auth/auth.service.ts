import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      throw new BadRequestException('Invalid credentials');
    }
    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    // Generate JWT
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
