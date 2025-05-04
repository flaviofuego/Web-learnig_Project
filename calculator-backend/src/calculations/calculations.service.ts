import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CalculationsService {
  private logger = new Logger('CalculationsService');

  constructor(private prisma: PrismaService) {}

  async calculate(expression: string, userId: string) {
    this.logger.debug(`Calculando: ${expression} para usuario: ${userId}`);
    
    let result: string;
    
    try {
      // Evaluar la expresión matemática
      result = eval(expression).toString();
    } catch (error) {
      this.logger.error(`Error al evaluar expresión: ${error.message}`);
      result = 'Error';
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`Usuario no encontrado con ID: ${userId}`);
      throw new NotFoundException('Usuario no encontrado');
    }

    this.logger.debug(`Guardando cálculo: ${expression} = ${result} para usuario ${userId} (${user.username})`);

    // Crear y guardar el cálculo
    const calculation = await this.prisma.calculation.create({
      data: {
        expression,
        result,
        user_id: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    this.logger.debug(`Cálculo guardado con ID: ${calculation.id}`);
    return calculation;
  }

  async getHistory(userId: string, userRole: string) {
    this.logger.debug(`Obteniendo historial para: ${userId}, rol: ${userRole}`);
    
    if (userRole === 'admin') {
      // Administradores pueden ver todo el historial
      const calculations = await this.prisma.calculation.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
      
      this.logger.debug(`Encontrados ${calculations.length} cálculos para admin`);
      return calculations;
    } else {
      // Usuarios regulares solo ven su propio historial
      const calculations = await this.prisma.calculation.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
      
      this.logger.debug(`Encontrados ${calculations.length} cálculos para usuario ${userId}`);
      return calculations;
    }
  }

  async getUserHistory(userId: string, requestorId: string, requestorRole: string) {
    this.logger.debug(`Usuario ${requestorId} (${requestorRole}) solicitando historial para usuario: ${userId}`);
    
    // Solo admins o el mismo usuario pueden ver su historial
    if (requestorRole !== 'admin' && requestorId !== userId) {
      throw new ForbiddenException('No autorizado para ver este historial');
    }

    const calculations = await this.prisma.calculation.findMany({
      where: {
        user_id: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    
    this.logger.debug(`Encontrados ${calculations.length} cálculos para usuario específico ${userId}`);
    return calculations;
  }
}