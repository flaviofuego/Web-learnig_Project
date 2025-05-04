// src/scripts/initialize-db.ts
import { createConnection } from 'typeorm';
import { User } from '../entities/user.entity';
import { Calculation } from '../entities/calculation.entity';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Carga las variables de entorno
config();

async function initialize() {
  console.log('Conectando a la base de datos...');
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    entities: [User, Calculation],
    synchronize: false, // No sincronizamos automáticamente
  });

  try {
    console.log('Ejecutando SQL para arreglar la tabla de usuarios...');
    // Actualizar valores NULL en username
    await connection.query(`UPDATE users SET username = 'user_' || id WHERE username IS NULL;`);
    
    // Modificar la columna para que no acepte NULL
    await connection.query(`ALTER TABLE users ALTER COLUMN username SET NOT NULL;`);
    
    // Si necesitas crear usuarios de prueba
    console.log('Verificando si necesitamos crear usuarios iniciales...');
    const userCount = await connection.getRepository(User).count();
    
    if (userCount === 0) {
      console.log('Creando usuarios iniciales...');
      // Crear usuario administrador
      const adminPassword = await bcrypt.hash('admin123', 10);
      await connection.getRepository(User).save({
        username: 'admin',
        password: adminPassword,
        role: 'admin',
      });

      // Crear usuario regular
      const userPassword = await bcrypt.hash('user123', 10);
      await connection.getRepository(User).save({
        username: 'user',
        password: userPassword,
        role: 'user',
      });
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await connection.close();
  }
}

initialize().catch(error => console.error('Error en el script de inicialización:', error));