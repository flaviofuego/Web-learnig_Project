import { Controller, Post, Get, Body, UseGuards, Request, Param, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CalculationsService } from './calculations.service';

@Controller('calculations')
@UseGuards(JwtAuthGuard)
export class CalculationsController {
  private logger = new Logger('CalculationsController');

  constructor(private calculationsService: CalculationsService) { }

  @Post()
  calculate(@Body() body: { expression: string }, @Request() req) {
    this.logger.debug(`Usuario ${req.user.username} (${req.user.userId}) calculando: ${body.expression}`);
    return this.calculationsService.calculate(body.expression, req.user.userId);
  }
  // En calculations.controller.ts
  @Get('history')
  getHistory(@Request() req) {
    console.log('Request usuario:', req.user);
    console.log('Request headers:', req.headers.authorization?.substring(0, 20) + '...');
    return this.calculationsService.getHistory(req.user.userId, req.user.role);
  }

  @Get('history/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getUserHistory(@Param('userId') userId: string, @Request() req) {
    this.logger.debug(`Admin ${req.user.username} solicitando historial para usuario: ${userId}`);
    return this.calculationsService.getUserHistory(userId, req.user.userId, req.user.role);
  }
}