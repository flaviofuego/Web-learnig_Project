import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CalculationsModule } from './calculations/calculations.module';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { Calculation } from './entities/calculation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: [User, Calculation],
        synchronize: false, // Modo seguro para producción
        logging: true, // Activar logs para depuración
        // Aumentar timeout para conexiones lentas
        connectTimeoutMS: 10000,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CalculationsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}