import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class LegoSets extends Model {
  @Column
  theme: string;

  @Column({ defaultValue: 0 })
  price: string;

  @Column
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

  @Column({ defaultValue: false })
  new: boolean;

  @Column
  popularity: number;
}
