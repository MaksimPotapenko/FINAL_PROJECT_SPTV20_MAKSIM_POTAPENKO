import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LegoSets } from './lego-sets.model';
import { ILegoSetsQuery } from './types';

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
    return this.legoSetsModel.findAndCountAll({
      limit,
      offset,
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
}
