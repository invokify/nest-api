import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private adminSupabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabaseUrl');
    const supabaseAnonKey = this.configService.get<string>('supabaseAnonKey');
    const supabaseServiceRoleKey = this.configService.get<string>('supabaseServiceRoleKey');

    // Regular client for normal operations
    this.supabase = createClient(
      supabaseUrl as string,
      supabaseAnonKey as string,
    );

    // Admin client for operations that need to bypass RLS
    this.adminSupabase = createClient(
      supabaseUrl as string,
      supabaseServiceRoleKey as string,
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAdminClient(): SupabaseClient {
    return this.adminSupabase;
  }
}