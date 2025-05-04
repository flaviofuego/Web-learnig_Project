import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';
import { Calculation } from '../entities/calculation.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calculation, User])],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}