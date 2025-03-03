import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfileController } from './api/profile/profile.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import configuration from './config/configuration';
import { AuthMiddleware } from './middleware/auth.middleware';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    SupabaseModule,
  ],
  controllers: [AppController, AuthController, ProfileController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('api/*'); // Apply to all routes
  }
}
