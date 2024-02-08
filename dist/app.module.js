"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const sequelizeConfig_service_1 = require("./config/sequelizeConfig.service");
const configuration_1 = require("./config/configuration");
const auth_module_1 = require("./auth/auth.module");
const payment_module_1 = require("./payment/payment.module");
const lego_sets_module_1 = require("./lego-sets/lego-sets.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useClass: sequelizeConfig_service_1.SequelizeConfigService,
            }),
            config_1.ConfigModule.forRoot({
                load: [configuration_1.databaseConfig],
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            payment_module_1.PaymentModule,
            lego_sets_module_1.LegoSetsModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map