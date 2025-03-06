import { Body, Controller, Get, Post } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ApiOperation, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dtos/login.dto';
import { LogoutResponseDto } from './dtos/logout.dto';
import { RefreshTokenDto, RefreshTokenResponseDto } from './dtos/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ 
    status: 201, 
    description: 'Successfully logged in',
    type: LoginResponseDto
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
  ) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

    if (error) {
      return { error: error.message };
    }

    return {
      user: data.user,
      token: data.session?.access_token,
      refresh_token: data.session?.refresh_token
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token successfully refreshed',
    type: RefreshTokenResponseDto
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.refreshSession({
        refresh_token: refreshTokenDto.refresh_token,
      });

    if (error) {
      return { error: error.message };
    }

    return { user: data.user, token: data.session?.access_token, refreshToken: data.session?.refresh_token };
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully logged out',
    type: LogoutResponseDto
  })
  @ApiResponse({ status: 500, description: 'Server error during logout' })
  async logout() {
    const { error } = await this.supabaseService.getClient().auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { message: 'Logged out' };
  }
}
