"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session = require("express-session");
const passport = require("passport");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const dist_1 = require("@nestjs/swagger/dist");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(session({
        secret: 'keyword',
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.enableCors({
        credentials: true,
        origin: ['http://localhost:3001', 'https://shop-client-ijcw.onrender.com'],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Аква термикс')
        .setDescription('api documentation')
        .setVersion('1.0')
        .addTag('api')
        .build();
    const document = dist_1.SwaggerModule.createDocument(app, config);
    dist_1.SwaggerModule.setup('swagger', app, document);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map