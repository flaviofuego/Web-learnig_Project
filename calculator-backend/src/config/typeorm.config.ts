// src/config/typeorm.config.ts
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { Calculation } from '../entities/calculation.entity';

// Carga las variables de entorno
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  ssl: { rejectUnauthorized: false },
  entities: [User, Calculation],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
});