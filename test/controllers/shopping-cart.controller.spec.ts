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

const mockedUser = {
  username: 'John',
  email: 'john@gmail.com',
  password: 'john123',
};

describe('Shopping Cart Controller', () => {
  let app: INestApplication;
  let legoSetsService: LegoSetsService;
  let usersService: UsersService;

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
        AuthModule,
      ],
    }).compile();

    legoSetsService = testModule.get<LegoSetsService>(LegoSetsService);
    usersService = testModule.get<UsersService>(UsersService);

    app = testModule.createNestApplication();
    app.use(
      session({
        secret: 'keyword',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

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

  it('should add cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .post(`/shopping-cart/add`)
      .send({ username: mockedUser.username, setId: 3 })
      .set('Cookie', login.headers['set-cookie']);

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.setId === 3)).toEqual(
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
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('should get all cart items', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
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
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('should get updated count of cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .patch('/shopping-cart/count/1')
      .send({ count: 2 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual({ count: 2 });
  });

  it('should get updated total price of cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const set = await legoSetsService.findOne(1);

    const response = await request(app.getHttpServer())
      .patch('/shopping-cart/total-price/1')
      .send({ total_price: set.price * 3 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual({ total_price: set.price * 3 });
  });

  it('should delete cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .delete('/shopping-cart/one/1')
      .set('Cookie', login.headers['set-cookie']);

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.setId === 1)).toBeUndefined();
  });

  it('should delete cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    await request(app.getHttpServer())
      .delete(`/shopping-cart/all/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toStrictEqual([]);
  });
});
