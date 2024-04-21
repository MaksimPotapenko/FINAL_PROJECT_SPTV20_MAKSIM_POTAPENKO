import { faker } from '@faker-js/faker';
import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class LegoSets extends Model {
  @Column
  theme: string;

  @Column({ defaultValue: 0 })
  price: number;

  @Column({ defaultValue: () => faker.internet.password() })
  vendor_code: string;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  images: string;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column({ defaultValue: false })
  bestseller: boolean;

  @Column({ defaultValue: true })
  new: boolean;

  @Column({ defaultValue: 1 })
  popularity: number;
}
