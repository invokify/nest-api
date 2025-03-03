import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SupabaseService } from '../supabase/supabase.service';

export interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly supabaseService: SupabaseService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    if (!this.supabaseService) {
      throw new UnauthorizedException('SupabaseService not initialized');
    }

    const token = authHeader.split(' ')[1];
    const client = this.supabaseService.getClient();
    if (!client) {
      throw new UnauthorizedException('Supabase client not initialized');
    }

    const { data, error } = await client.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    req.user = data.user; // Attach user to request
    next();
  }
}
