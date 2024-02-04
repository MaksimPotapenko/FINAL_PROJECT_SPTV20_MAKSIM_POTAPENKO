import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({ example: 'ivan123' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      user: {
        userId: 1,
        username: 'Ivan',
        password: 'ivan123',
      },
    },
  })
  user: {
    userId: number;
    username: string;
    password: string;
  };

  @ApiProperty({ example: 'Logged in' })
  msg: string;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'session has ended' })
  msg: string;
}

export class LoginCheckResponse {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({ example: 'ivan@gmail.com' })
  email: string;
}

export class SignupResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({
    example: '$2b$10$3JVv/iT7qmqBZRUDR93FEe4w5ow9J02lBVYoCZrTnm.pEpajiCC/u',
  })
  password: string;

  @ApiProperty({ example: 'ivan@gmail.com' })
  email: string;

  @ApiProperty({ example: '2024-02-04T14:02:26.172Z' })
  updatedAt: string;

  @ApiProperty({ example: '2024-02-04T14:02:26.172Z' })
  createdAt: string;
}
