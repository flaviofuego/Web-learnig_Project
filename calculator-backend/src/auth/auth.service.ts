// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.debug(`Validando usuario: ${username}`);
    
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // src/auth/auth.service.ts (parte de login)
async login(user: any) {
 
  // Asegúrate de que user.id exista antes de usarlo
  const payload = { 
    username: user.username, 
    sub: user.id, // Aquí debe estar el ID correcto del usuario
    role: user.role 
  };
  
  this.logger.debug(`Generando token para ${user.username}, ID: ${user.id}, Rol: ${user.role}`);
  const generatedToken = this.jwtService.sign(payload);
  this.logger.debug(`Token generado: ${generatedToken.substring(0, 20)}...`);
  this.logger.debug(`JWT Secret usado: ${this.configService.get('JWT_SECRET')?.substring(0, 5)}...`);
  
  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
  
}

  async register(username: string, password: string) {
    this.logger.debug(`Iniciando registro para: ${username}`);
    
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      this.logger.warn(`Intento de registro con nombre de usuario existente: ${username}`);
      throw new UnauthorizedException('El nombre de usuario ya existe');
    }

    try {
      // Generar hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Crear el nuevo usuario
      const user = this.userRepository.create({
        username,
        password: hashedPassword,
        role: 'user',  // Rol por defecto
      });
      
      // Guardar el usuario en la base de datos
      const savedUser = await this.userRepository.save(user);
      this.logger.debug(`Usuario registrado exitosamente: ${username}`);
      
      // Retornar datos del usuario sin la contraseña
      const { password: _, ...result } = savedUser;
      return result;
    } catch (error) {
      this.logger.error(`Error al registrar usuario: ${error.message}`, error.stack);
      throw new UnauthorizedException('Error al registrar usuario: ' + error.message);
    }
  }
}