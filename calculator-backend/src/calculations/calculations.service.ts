import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calculation } from '../entities/calculation.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CalculationsService {
  private logger = new Logger('CalculationsService');
  
  constructor(
    @InjectRepository(Calculation)
    private calculationRepository: Repository<Calculation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async calculate(expression: string, userId: string): Promise<Calculation> {
    this.logger.debug(`Calculando expresión: ${expression} para usuario ID: ${userId}`);
    
    let result: string;
    
    try {
      // Evaluar la expresión matemática
      result = eval(expression).toString();
      this.logger.debug(`Resultado calculado: ${result}`);
    } catch (error) {
      this.logger.error(`Error al evaluar la expresión: ${error.message}`);
      result = 'Error';
    }
  
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      
      this.logger.debug(`Usuario encontrado: ${user ? 'Sí' : 'No'}`);
      if (!user) {
        this.logger.error(`Usuario con ID ${userId} no encontrado`);
        throw new NotFoundException('Usuario no encontrado');
      }
  
      this.logger.debug(`Guardando cálculo: ${expression} = ${result} para usuario ${userId} (${user.username})`);

      // Crear el objeto de cálculo
      const calculation = this.calculationRepository.create({
        expression,
        result,
        user,
      });
      
      this.logger.debug(`Objeto de cálculo creado: ${JSON.stringify(calculation)}`);
  
      // Guardar en la base de datos
      const savedCalculation = await this.calculationRepository.save(calculation);
      this.logger.debug(`Cálculo guardado con ID: ${savedCalculation.id}`);
      
      return savedCalculation;
    } catch (error) {
      this.logger.error(`Error al guardar cálculo: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getHistory(userId: string, userRole: string): Promise<Calculation[]> {
    this.logger.debug(`Obteniendo historial para usuario: ${userId}, rol: ${userRole}`);
    
    if (userRole === 'admin') {
      // Los administradores pueden ver todos los cálculos
      const calculations = await this.calculationRepository.find({
        relations: ['user'],
        order: { timestamp: 'DESC' },
      });
      
      this.logger.debug(`Encontrados ${calculations.length} cálculos para el admin`);
      return calculations;
    } else {
      // Los usuarios normales solo pueden ver sus propios cálculos
      const calculations = await this.calculationRepository.find({
        where: { user: { id: userId } },
        order: { timestamp: 'DESC' },
      });
      
      this.logger.debug(`Encontrados ${calculations.length} cálculos para el usuario ${userId}`);
      return calculations;
    }
  }

  async getUserHistory(userId: string, requestorId: string, requestorRole: string): Promise<Calculation[]> {
    this.logger.debug(`Usuario ${requestorId} (${requestorRole}) solicitando historial para usuario ${userId}`);
    
    // Solo los administradores o el propio usuario pueden ver su historial
    if (requestorRole !== 'admin' && requestorId !== userId) {
      throw new ForbiddenException('No está autorizado para ver este historial');
    }

    const calculations = await this.calculationRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
    
    this.logger.debug(`Encontrados ${calculations.length} cálculos para el usuario específico ${userId}`);
    return calculations;
  }
}