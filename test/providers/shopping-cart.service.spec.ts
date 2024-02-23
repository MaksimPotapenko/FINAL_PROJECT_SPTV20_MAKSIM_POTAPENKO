import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { LegoSetsModule } from 'src/lego-sets/lego-sets.module';
import { LegoSetsService } from '../../src/lego-sets/lego-sets.service';
import { UsersService } from '../../src/users/users.service';
import { ShoppingCart } from '../../src/shopping-cart/shopping-cart.model';
import { ShoppingCartModule } from '../../src/shopping-cart/shopping-cart.module';
import { ShoppingCartService } from '../../src/shopping-cart/shopping-cart.service';

const mockedUser = {
  username: 'John',
  email: 'john@gmail.com',
  password: 'john123',
};

describe('Shopping Cart Service', () => {
  let app: INestApplication;
  let legoSetsService: LegoSetsService;
  let usersService: UsersService;
  let shoppingCartService: ShoppingCartService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        ShoppingCartModule,
        LegoSetsModule,
      ],
    }).compile();

    legoSetsService = testModule.get<LegoSetsService>(LegoSetsService);
    usersService = testModule.get<UsersService>(UsersService);
    shoppingCartService =
      testModule.get<ShoppingCartService>(ShoppingCartService);

    app = testModule.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    const user = new User();

    const hashedPassword = await bcrypt.hash(mockedUser.password, 10);

    user.username = mockedUser.username;
    user.password = hashedPassword;
    user.email = mockedUser.email;

    return user.save();
  });

  beforeEach(async () => {
    const cart = new ShoppingCart();
    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });
    const set = await legoSetsService.findOne(1);

    cart.userId = user.id;
    cart.setId = set.id;
    cart.theme = set.theme;
    cart.price = set.price;
    cart.in_stock = set.in_stock;
    cart.image = JSON.parse(set.images)[0];
    cart.name = set.name;
    cart.total_price = set.price;

    return cart.save();
  });

  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
    await ShoppingCart.destroy({ where: { setId: 1 } });
  });

  it('should return all cart items', async () => {
    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const cart = await shoppingCartService.findAll(user.id);

    cart.forEach((item) =>
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          userId: user.id,
          setId: expect.any(Number),
          theme: expect.any(String),
          price: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          in_stock: expect.any(Number),
          count: expect.any(Number),
          total_price: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ),
    );
  });

  it('should add cart items', async () => {
    await shoppingCartService.add({
      username: mockedUser.username,
      setId: 3,
    });

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart.find((item) => item.setId === 3)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        setId: 3,
        theme: expect.any(String),
        price: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        in_stock: expect.any(Number),
        count: expect.any(Number),
        total_price: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should return updated count', async () => {
    const result = await shoppingCartService.updateCount(2, 1);

    expect(result).toEqual({ count: 2 });
  });

  it('should return updated total price', async () => {
    const set = await legoSetsService.findOne(1);
    const result = await shoppingCartService.updateTotalPrice(set.price * 3, 1);

    expect(result).toEqual({ total_price: set.price * 3 });
  });

  it('should delete cart item', async () => {
    await shoppingCartService.remove(1);

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart.find((item) => item.setId === 1)).toBeUndefined();
  });

  it('should delete all cart items', async () => {
    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    await shoppingCartService.removeAll(user.id);

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart).toStrictEqual([]);
  });
});
