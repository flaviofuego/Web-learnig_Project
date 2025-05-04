// src/auth/auth.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  UseGuards,  // Añadir esta importación
  Request, 
  HttpException,
  HttpStatus,
  HttpCode,   // Añadir esta importación
  Logger
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';



// Interfaz para tipar la solicitud
interface RequestWithUser {
  user: {
    userId: string;
    username: string;
    role: string;
  }
}

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    this.logger.log(`Intentando registrar usuario: ${body.username}`);
    
    try {
      const result = await this.authService.register(body.username, body.password);
      this.logger.log(`Usuario registrado exitosamente: ${body.username}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al registrar usuario: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Error en el registro',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    this.logger.log(`Intento de inicio de sesión: ${body.username}`);
    
    try {
      const user = await this.authService.validateUser(body.username, body.password);
      if (!user) {
        this.logger.warn(`Credenciales inválidas para: ${body.username}`);
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }
      
      this.logger.log(`Inicio de sesión exitoso: ${body.username}`);
      return this.authService.login(user);
    } catch (error) {
      this.logger.error(`Error en inicio de sesión: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Error en inicio de sesión',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('refresh')
  async refreshTokens(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshToken(body.userId, body.refreshToken);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: RequestWithUser) {
    return this.authService.logout(req.user.userId);
  }
}