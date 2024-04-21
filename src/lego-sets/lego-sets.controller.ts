import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LegoSetsService } from './lego-sets.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  FindOneResponse,
  GetBestsellersResponse,
  GetByNameRequest,
  GetByNameResponse,
  GetNewResponse,
  PaginateAndFilterResponse,
  SearchRequest,
  SearchResponse,
} from './types';

@Controller('lego-sets')
export class LegoSetsController {
  constructor(private readonly legoSetsService: LegoSetsService) {}

  @ApiOkResponse({ type: PaginateAndFilterResponse })
  @UseGuards(AuthenticatedGuard)
  @Get()
  paginateAndFilter(@Query() query) {
    return this.legoSetsService.paginateAndFilter(query);
  }

  @ApiOkResponse({ type: FindOneResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('find/:id')
  getOne(@Param('id') id: string) {
    return this.legoSetsService.findOne(id);
  }

  @ApiOkResponse({ type: GetBestsellersResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('bestsellers')
  getBestsellers() {
    return this.legoSetsService.bestsellers();
  }

  @ApiOkResponse({ type: GetNewResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('new')
  getNew() {
    return this.legoSetsService.new();
  }

  @ApiOkResponse({ type: SearchResponse })
  @ApiBody({ type: SearchRequest })
  @UseGuards(AuthenticatedGuard)
  @Post('search')
  search(@Body() { search }: { search: string }) {
    return this.legoSetsService.searchByString(search);
  }

  @ApiOkResponse({ type: GetByNameResponse })
  @ApiBody({ type: GetByNameRequest })
  @UseGuards(AuthenticatedGuard)
  @Post('name')
  getByName(@Body() { name }: { name: string }) {
    return this.legoSetsService.findOneByName(name);
  }

  @Post('create')
  async createLegoSet(
    @Body('theme') theme: string,
    @Body('price') price: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('images') images: string[],
    @Body('in_stock') in_stock: number,
  ) {
    return this.legoSetsService.createLegoSet(
      theme,
      price,
      name,
      description,
      images,
      in_stock,
    );
  }
}
