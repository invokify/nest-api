import { Body, Controller, Get, Post } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
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
  async refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.refreshSession({
        refresh_token,
      });

    if (error) {
      return { error: error.message };
    }

    return { user: data.user, token: data.session?.access_token, refreshToken: data.session?.refresh_token };
  }

  @Get('logout')
  async logout() {
    const { error } = await this.supabaseService.getClient().auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { message: 'Logged out' };
  }
}
