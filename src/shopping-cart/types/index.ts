import { ApiProperty } from '@nestjs/swagger';

class ShoppingCartItem {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 5 })
  userId: number;

  @ApiProperty({ example: 3 })
  setId: number;

  @ApiProperty({ example: 'Indiana Jones' })
  theme: string;

  @ApiProperty({ example: 866 })
  price: number;

  @ApiProperty({ example: 'Valetudo veritatis.' })
  name: string;

  @ApiProperty({
    example: 'https://loremflickr.com/640/480/lego?lock=1014527114084352',
  })
  image: string;

  @ApiProperty({ example: 5 })
  in_stock: number;

  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({ example: 866 })
  total_price: number;

  @ApiProperty({ example: '2024-02-15T22:37:20.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-02-15T22:37:20.000Z' })
  updatedAt: string;
}

export class GetAllResponse extends ShoppingCartItem {}
export class AddToCardResponse extends ShoppingCartItem {}
export class UpdateCountResponse {
  @ApiProperty({ example: 1 })
  count: number;
}
export class UpdateCountRequest {
  @ApiProperty({ example: 1 })
  count: number;
}
export class TotalPriceResponse {
  @ApiProperty({ example: 500 })
  total_price: number;
}
export class TotalPriceRequest {
  @ApiProperty({ example: 500 })
  total_price: number;
}
