// src/scripts/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userRepository = getRepository(User);
    
    // Crear usuario admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await userRepository.save({
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    });
    
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos', error);
  } finally {
    await app.close();
  }
}

bootstrap();