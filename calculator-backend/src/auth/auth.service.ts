import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, refresh_token, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    this.logger.debug(`Generando token para: ${user.username}`);
    
    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role 
    };
    
    // Generar refresh token
    const refreshToken = uuidv4();
    
    // Almacenar refresh token en la base de datos
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: await bcrypt.hash(refreshToken, 10) },
    });
    
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Token generado: ${token.substring(0, 20)}...`);
    
    return {
      access_token: token,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async register(username: string, password: string) {
    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    
    if (existingUser) {
      throw new UnauthorizedException('El nombre de usuario ya existe');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear el nuevo usuario
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'user',
      },
    });
    
    const { password: _, ...result } = user;
    return result;
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Acceso denegado');
    }
    
    // Verificar que el refresh token sea válido
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Acceso denegado');
    }
    
    // Generar nuevo access token
    const payload = { username: user.username, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
    
    return { message: 'Sesión cerrada correctamente' };
  }
}