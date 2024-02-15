import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LegoSetsService } from 'src/lego-sets/lego-sets.service';
import { UsersService } from 'src/users/users.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ShoppingCart } from './shopping-cart.model';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart)
    private shoppingCartModel: typeof ShoppingCart,
    private readonly usersService: UsersService,
    private readonly legoSetsService: LegoSetsService,
  ) {}

  async findAll(userId: number | string): Promise<ShoppingCart[]> {
    return this.shoppingCartModel.findAll({ where: { userId } });
  }

  async add(addToCartDto: AddToCartDto) {
    //ищем пользователя который добавил элемент в корзину
    const cart = new ShoppingCart();
    const user = await this.usersService.findOne({
      where: { username: addToCartDto.username },
    });
    //ищем элемент в корзине
    const set = await this.legoSetsService.findOne(addToCartDto.setId);

    cart.userId = user.id;
    cart.setId = set.id;
    cart.theme = set.theme;
    cart.price = set.price;
    cart.in_stock = set.in_stock;
    cart.image = JSON.parse(set.images)[0];
    cart.name = set.name;
    cart.total_price = set.price;

    return cart.save();
  }

  async updateCount(
    count: number,
    setId: number | string,
  ): Promise<{ count: number }> {
    //обнови поле count у записи где есть setId который мы прсылаем
    await this.shoppingCartModel.update({ count }, { where: { setId } });
    //найти тот setId
    const set = await this.shoppingCartModel.findOne({ where: { setId } });

    return { count: set.count };
  }

  async updateTotalPrice(
    total_price: number,
    setId: number | string,
  ): Promise<{ total_price: number }> {
    await this.shoppingCartModel.update({ total_price }, { where: { setId } });

    const set = await this.shoppingCartModel.findOne({ where: { setId } });

    return { total_price: set.total_price };
  }

  async remove(setId: number | string): Promise<void> {
    const part = await this.shoppingCartModel.findOne({ where: { setId } });

    await part.destroy();
  }

  async removeAll(userId: number | string): Promise<void> {
    await this.shoppingCartModel.destroy({ where: { userId } });
  }
}
