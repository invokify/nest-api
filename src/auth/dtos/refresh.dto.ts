import { ApiProperty } from '@nestjs/swagger';
 
export class RefreshTokenDto {
    @ApiProperty({ description: 'Refresh token received from login' })
    refresh_token: string;
}
  
export class RefreshTokenResponseDto {
    @ApiProperty({ description: 'User object containing user details' })
    user: any;
  
    @ApiProperty({ description: 'New JWT access token' })
    token: string;
  
    @ApiProperty({ description: 'New refresh token' })
    refreshToken: string;
}