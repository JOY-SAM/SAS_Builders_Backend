import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Request Body: LoginDto, Response: LoginResponseDto' })
  @ApiResponse({ status: 200, description: 'Return JWT access token (LoginResponseDto)', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  // @Post('register')
  // @ApiOperation({ summary: 'User registration', description: 'Request Body: CreateUserDto, Response: UserEntity' })
  // @ApiResponse({ status: 201, description: 'User successfully created (UserEntity)', type: UserEntity })
  // async register(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.register(createUserDto);
  // }
}
