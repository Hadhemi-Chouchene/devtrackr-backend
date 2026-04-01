import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
