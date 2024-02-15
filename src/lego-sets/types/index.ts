import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

class LegoSets {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  theme: string;

  @ApiProperty({ example: 50 })
  price: string;

  @ApiProperty({ example: faker.internet.password() })
  vendor_code: string;

  @ApiProperty({ example: faker.lorem.word() })
  name: string;

  @ApiProperty({ example: faker.lorem.sentence() })
  description: string;

  @ApiProperty({ example: faker.image.city() })
  images: string;

  @ApiProperty({ example: 5 })
  in_stock: number;

  @ApiProperty({ example: false })
  bestseller: boolean;

  @ApiProperty({ example: false })
  new: boolean;

  @ApiProperty({ example: 123 })
  popularity: number;

  @ApiProperty({ example: '2024-02-08T19:54:31.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-02-08T19:54:31.000Z' })
  updatedAt: string;
}

export class PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: LegoSets, isArray: true })
  rows: LegoSets;
}

export class Bestsellers extends LegoSets {
  @ApiProperty({ example: true })
  bestseller: boolean;
}

export class GetBestsellersResponse extends PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: LegoSets, isArray: true })
  rows: Bestsellers;
}

export class NewSets extends LegoSets {
  @ApiProperty({ example: true })
  new: boolean;
}

export class GetNewResponse extends PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: LegoSets, isArray: true })
  rows: NewSets;
}

export class SearchByLetterResponse extends LegoSets {
  @ApiProperty({ example: 'Atqui tantillus.' })
  name: string;
}

export class SearchResponse extends PaginateAndFilterResponse {
  @ApiProperty({ type: SearchByLetterResponse, isArray: true })
  rows: SearchByLetterResponse;
}
export class SearchRequest {
  @ApiProperty({ example: 't' })
  search: string;
}

export class GetByNameResponse extends LegoSets {
  @ApiProperty({ example: 'Atqui tantillus.' })
  name: string;
}

export class GetByNameRequest {
  @ApiProperty({ example: 'Atqui tantillus.' })
  name: string;
}

export class FindOneResponse extends LegoSets {}

export interface ILegoSetsQuery {
  limit: string;
  offset: string;
}
