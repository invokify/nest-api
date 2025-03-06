import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'niko@invokify.dev', description: 'User email address' })
    email: string;

    @ApiProperty({ example: '123456', description: 'User password' })
    password: string;
}


export class LoginResponseDto {
    @ApiProperty({ description: 'User object containing user details' })
    user: any;

    @ApiProperty({ description: 'JWT access token' })
    token: string;

    @ApiProperty({ description: 'Refresh token for getting new access tokens' })
    refresh_token: string;
}

