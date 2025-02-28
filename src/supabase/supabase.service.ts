import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabaseUrl');
    const supabaseAnonKey = this.configService.get<string>('supabaseAnonKey');
    this.supabase = createClient(
      supabaseUrl as string,
      supabaseAnonKey as string,
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
