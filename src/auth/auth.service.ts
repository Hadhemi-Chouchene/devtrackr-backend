import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    const { email, password } = registerDTO;

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
  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
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
    const payload = { sub: user._id.toString(), email: user.email };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
