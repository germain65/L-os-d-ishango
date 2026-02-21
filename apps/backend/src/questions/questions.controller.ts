import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpCode, 
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService, CreateQuestionDto, UpdateQuestionDto, QuestionFilterDto, QuestionAttemptDto } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, Role } from '@prisma/client';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Endpoint public pour lister les questions
  @Get()
  async findAll(@Query() filters: QuestionFilterDto) {
    return this.questionsService.findAll(filters);
  }

  // Endpoint public pour obtenir une question spécifique
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  // Endpoint protégé pour créer une question (admin uniquement)
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createQuestionDto: CreateQuestionDto,
    @CurrentUser() user: User,
  ) {
    // Vérifier si l'utilisateur est admin
    if (user.role !== Role.ADMIN) {
      throw new Error('Accès non autorisé');
    }
    
    return this.questionsService.create(createQuestionDto);
  }

  // Endpoint protégé pour mettre à jour une question (admin uniquement)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateQuestionDto: UpdateQuestionDto,
    @CurrentUser() user: User,
  ) {
    // Vérifier si l'utilisateur est admin
    if (user.role !== Role.ADMIN) {
      throw new Error('Accès non autorisé');
    }
    
    return this.questionsService.update(id, updateQuestionDto);
  }

  // Endpoint protégé pour supprimer une question (admin uniquement)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    // Vérifier si l'utilisateur est admin
    if (user.role !== Role.ADMIN) {
      throw new Error('Accès non autorisé');
    }
    
    await this.questionsService.remove(id);
  }

  // Endpoint pour valider une réponse
  @Post(':id/attempt')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async validateAnswer(
    @Param('id') id: string,
    @Body(ValidationPipe) attemptDto: QuestionAttemptDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.validateAnswer(id, attemptDto);
  }

  // Endpoint pour obtenir la liste des thèmes disponibles
  @Get('themes/list')
  async getThemes() {
    return this.questionsService.getThemes();
  }

  // Endpoint pour obtenir les statistiques des questions
  @Get('stats')
  async getStats() {
    return this.questionsService.getStats();
  }
}
