import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LegoSets } from './lego-sets.model';
import { ILegoSetsFilter, ILegoSetsQuery } from './types';
import { faker } from '@faker-js/faker';

@Injectable()
export class LegoSetsService {
  constructor(
    @InjectModel(LegoSets)
    private legoSetsModel: typeof LegoSets,
  ) {}

  async paginateAndFilter(
    query: ILegoSetsQuery,
  ): Promise<{ count: number; rows: LegoSets[] }> {
    const limit = +query.limit;
    const offset = +query.offset * 20;
    const filter = {} as Partial<ILegoSetsFilter>;

    if (query.priceFrom && query.priceTo) {
      filter.price = {
        [Op.between]: [+query.priceFrom, +query.priceTo],
      };
    }

    if (query.lego) {
      filter.theme = JSON.parse(decodeURIComponent(query.lego));
    }

    return this.legoSetsModel.findAndCountAll({
      limit,
      offset,
      where: filter,
    });
  }

  async bestsellers(): Promise<{ count: number; rows: LegoSets[] }> {
    return this.legoSetsModel.findAndCountAll({
      where: { bestseller: true },
    });
  }

  async new(): Promise<{ count: number; rows: LegoSets[] }> {
    return this.legoSetsModel.findAndCountAll({
      where: { new: true },
    });
  }

  async findOne(id: number | string): Promise<LegoSets> {
    return this.legoSetsModel.findOne({
      where: { id },
    });
  }

  async findOneByName(name: string): Promise<LegoSets> {
    return this.legoSetsModel.findOne({
      where: { name },
    });
  }

  async searchByString(
    str: string,
  ): Promise<{ count: number; rows: LegoSets[] }> {
    return this.legoSetsModel.findAndCountAll({
      limit: 20,
      where: { name: { [Op.like]: `%${str}%` } },
    });
  }

  async createLegoSet(
    theme: string,
    price: number,
    name: string,
    description: string,
    images: string[],
    in_stock: number,
  ): Promise<LegoSets> {
    if (!this.isValidTheme(theme)) {
      throw new BadRequestException('Invalid theme');
    }
    const vendorCode = this.generateVendorCode();
    const imagesJson = JSON.stringify([...Array(3)].map(() => `${images}`));
    const legoSet = new LegoSets({
      theme,
      price,
      name,
      description,
      images: imagesJson,
      in_stock: in_stock,
      vendor_code: vendorCode,
    });
    return legoSet.save();
  }

  isValidTheme(theme: string): boolean {
    const themes = [
      'Star Wars',
      'Batman',
      'Harry Potter',
      'Disney',
      'Marvel',
      'Lord of the Rings',
      'Indiana Jones',
      'Jurassic World',
      'NINJAGO',
      'Minecraft',
      'Classic',
      'City',
    ];
    return themes.includes(theme);
  }

  generateVendorCode(): string {
    return faker.internet.password();
  }

  async deleteLegoSet(id: string): Promise<void> {
    const set = await this.legoSetsModel.findOne({ where: { id } });

    await set.destroy();
  }
}
