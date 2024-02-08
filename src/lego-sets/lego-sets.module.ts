import { Module } from '@nestjs/common';
import { LegoSetsController } from './lego-sets.controller';
import { LegoSetsService } from './lego-sets.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LegoSets } from './lego-sets.model';

@Module({
  imports: [SequelizeModule.forFeature([LegoSets])],
  controllers: [LegoSetsController],
  providers: [LegoSetsService],
  exports: [LegoSetsService],
})
export class LegoSetsModule {}
