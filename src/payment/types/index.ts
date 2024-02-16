import { ApiProperty } from '@nestjs/swagger';

export class MakePaymentResponse {
  @ApiProperty({ example: '2d613e9d-000f-5000-8000-1302a5e17a62' })
  id: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: { value: '100', currency: 'RUB' } })
  amount: {
    value: string;
    currency: string;
  };

  @ApiProperty({
    example: {
      type: 'redirect',
      confirmation_url:
        'https://yoomoney.ru/checkout/payments/v2/contract?orderId=2b',
    },
  })
  confirmation: {
    type: string;
    confirmation_url: string;
  };

  @ApiProperty({
    example: {
      account_id: '332054',
      gateway_id: '2057935',
    },
  })
  recipient: {
    account_id: string;
    gateway_id: string;
  };

  @ApiProperty({ example: true })
  test: boolean;

  @ApiProperty({ example: false })
  paid: boolean;

  @ApiProperty({ example: false })
  refundable: boolean;

  @ApiProperty({ example: {} })
  metadata: object;
}
