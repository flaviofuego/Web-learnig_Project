// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, Logger, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  // src/auth/auth.service.ts (parte de login)
  async login(user: any) {
    // Datos para el access token (JWT)
    const payload = { username: user.username, sub: user.id, role: user.role };

    // Generar refresh token
    const refreshToken = uuidv4();

    // Almacenar refresh token en la base de datos
    await this.userRepository.update(user.id, {
      refreshToken: await bcrypt.hash(refreshToken, 10),
    });

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m', // Token de acceso de corta duración
      }),
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    // Verificar que el refresh token sea válido
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    // Generar nuevo access token
    const payload = { username: user.username, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
    };
  }
  async logout(userId: string) {
    // Eliminar refresh token de la base de datos
    await this.userRepository.update(userId, {
      refreshToken: '',
    });

    return { message: 'Logout successful' };
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