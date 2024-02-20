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

const mockedUser = {
  username: 'John',
  email: 'john@gmail.com',
  password: 'john123',
};

describe('Lego Sets Controller', () => {
  let app: INestApplication;

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
        LegoSetsModule,
        AuthModule,
      ],
    }).compile();

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

  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
  });

  it('should get one set', async () => {
    //получить 1 набор
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/lego-sets/find/1')
      //получить запись таблицы lego-sets с ид 1
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        price: expect.any(Number),
        vendor_code: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        images: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        popularity: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  //   it('should get bestsellers', async () => {
  //     //получить бестселлер
  //     const login = await request(app.getHttpServer())
  //       .post('/users/login')
  //       .send({ username: mockedUser.username, password: mockedUser.password });

  //     const response = await request(app.getHttpServer())
  //       .get('/lego-sets/bestsellers')
  //       .set('Cookie', login.headers['set-cookie']);

  //     expect(response.body.rows).toEqual(
  //       expect.arrayContaining([
  //         {
  //           id: expect.any(Number),
  //           price: expect.any(Number),
  //           vendor_code: expect.any(String),
  //           name: expect.any(String),
  //           description: expect.any(String),
  //           images: expect.any(String),
  //           in_stock: expect.any(Number),
  //           bestseller: true,
  //           new: expect.any(Boolean),
  //           popularity: expect.any(Number),
  //           createdAt: expect.any(String),
  //           updatedAt: expect.any(String),
  //         },
  //       ]),
  //     );
  //   });

  //   it('should get new sets', async () => {
  //     //получить новый
  //     const login = await request(app.getHttpServer())
  //       .post('/users/login')
  //       .send({ username: mockedUser.username, password: mockedUser.password });

  //     const response = await request(app.getHttpServer())
  //       .get('/lego-sets/new')
  //       .set('Cookie', login.headers['set-cookie']);

  //     expect(response.body.rows).toEqual(
  //       expect.arrayContaining([
  //         {
  //           id: expect.any(Number),
  //           price: expect.any(Number),
  //           vendor_code: expect.any(String),
  //           name: expect.any(String),
  //           description: expect.any(String),
  //           images: expect.any(String),
  //           in_stock: expect.any(Number),
  //           bestseller: expect.any(Boolean),
  //           new: true,
  //           popularity: expect.any(Number),
  //           createdAt: expect.any(String),
  //           updatedAt: expect.any(String),
  //         },
  //       ]),
  //     );
  //   });

  //   it('should search by string', async () => {
  //     const body = { search: 'tas' };
  //     const login = await request(app.getHttpServer())
  //       .post('/users/login')
  //       .send({ username: mockedUser.username, password: mockedUser.password });

  //     const response = await request(app.getHttpServer())
  //       .post('/lego-sets/search')
  //       .send(body)
  //       .set('Cookie', login.headers['set-cookie']);

  //     expect(response.body.rows.length).toBeLessThanOrEqual(20);
  //     response.body.rows.forEach((element) => {
  //       expect(element.name.toLowerCase()).toContain(body.search);
  //     });
  //     expect(response.body.rows).toEqual(
  //       expect.arrayContaining([
  //         {
  // id: expect.any(Number),
  // price: expect.any(Number),
  // vendor_code: expect.any(String),
  // name: expect.any(String),
  // description: expect.any(String),
  // images: expect.any(String),
  // in_stock: expect.any(Number),
  // bestseller: expect.any(Boolean),
  // new: expect.any(Boolean),
  // popularity: expect.any(Number),
  // createdAt: expect.any(String),
  // updatedAt: expect.any(String),
  //         },
  //       ]),
  //     );
  //   });

  it('should get by name', async () => {
    const body = { name: 'Vilitas administratio.' };
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/lego-sets/name')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        price: expect.any(Number),
        vendor_code: expect.any(String),
        name: 'Vilitas administratio.',
        description: expect.any(String),
        images: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        popularity: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });
});
