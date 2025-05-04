// En jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger('JwtAuthGuard');
  
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`Verificando autorización para: ${request.url}`);
    this.logger.debug(`Token recibido: ${request.headers.authorization?.substring(0, 20)}...`);
    
    return super.canActivate(context);
  }
  
  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(`Error de autorización: ${err?.message || 'Usuario no encontrado'}`);
      this.logger.error(`Info adicional: ${JSON.stringify(info)}`);
      throw err || new UnauthorizedException('Unauthorized access');
    }
    this.logger.debug(`Usuario autorizado: ${user.username}, ID: ${user.userId}, Rol: ${user.role}`);
    return user;
  }
}