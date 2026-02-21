import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Question, QuestionType, Categorie } from '@prisma/client';

// DTOs pour les questions
export interface CreateQuestionDto {
  enonce: string;
  solution: string;
  type: QuestionType;
  theme: string;
  niveau: Categorie;
  difficulte: number;
  options?: any; // Pour QCM
  tolerance?: number; // Pour numérique
}

export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {}

export interface QuestionFilterDto {
  theme?: string;
  niveau?: Categorie;
  difficulte?: number;
  type?: QuestionType;
  page?: number;
  limit?: number;
}

export interface QuestionAttemptDto {
  reponse: string;
  tempsMs?: number;
}

export interface QuestionValidationDto {
  correct: boolean;
  points: number;
  solution?: string;
  explication?: string;
}

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // CRUD de base
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    // Validation des données
    this.validateQuestionData(createQuestionDto);

    return this.prisma.question.create({
      data: {
        ...createQuestionDto,
        options: createQuestionDto.options || undefined,
        tolerance: createQuestionDto.tolerance || undefined,
      },
    });
  }

  async findAll(filters: QuestionFilterDto = {}) {
    const { theme, niveau, difficulte, type, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Appliquer les filtres
    if (theme) {
      where.theme = {
        contains: theme,
        mode: 'insensitive',
      };
    }

    if (niveau) {
      where.niveau = niveau;
    }

    if (difficulte) {
      where.difficulte = difficulte;
    }

    if (type) {
      where.type = type;
    }

    // Récupérer les questions et le total
    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { niveau: 'asc' },
          { difficulte: 'asc' },
          { theme: 'asc' },
        ],
      }),
      this.prisma.question.count({ where }),
    ]);

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question non trouvée');
    }

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    // Validation des données si fournies
    if (Object.keys(updateQuestionDto).length > 0) {
      this.validateQuestionData(updateQuestionDto as CreateQuestionDto);
    }

    try {
      return await this.prisma.question.update({
        where: { id },
        data: {
          ...updateQuestionDto,
          options: updateQuestionDto.options || undefined,
          tolerance: updateQuestionDto.tolerance || undefined,
        },
      });
    } catch (error) {
      throw new NotFoundException('Question non trouvée');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.question.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Question non trouvée');
    }
  }

  // Validation de réponse
  async validateAnswer(id: string, attemptDto: QuestionAttemptDto): Promise<QuestionValidationDto> {
    const question = await this.findOne(id);
    
    const validation = this.performValidation(question, attemptDto.reponse);
    
    return {
      correct: validation.correct,
      points: validation.correct ? 1 : 0,
      solution: question.solution,
      explication: this.generateExplication(question, validation),
    };
  }

  // Méthodes privées de validation
  private validateQuestionData(data: CreateQuestionDto): void {
    // Validation du type
    if (!Object.values(QuestionType).includes(data.type)) {
      throw new BadRequestException('Type de question invalide');
    }

    // Validation de la catégorie
    if (!Object.values(Categorie).includes(data.niveau)) {
      throw new BadRequestException('Catégorie invalide');
    }

    // Validation de la difficulté
    if (data.difficulte < 1 || data.difficulte > 5) {
      throw new BadRequestException('La difficulté doit être entre 1 et 5');
    }

    // Validation spécifique au type
    switch (data.type) {
      case QuestionType.NUMERIQUE:
        if (data.tolerance && data.tolerance < 0) {
          throw new BadRequestException('La tolérance doit être positive');
        }
        break;
      
      case QuestionType.QCM:
        if (!data.options || !Array.isArray(data.options)) {
          throw new BadRequestException('Les options sont requises pour un QCM');
        }
        if (data.options.length < 2 || data.options.length > 5) {
          throw new BadRequestException('Un QCM doit avoir entre 2 et 5 options');
        }
        break;
      
      case QuestionType.LATEX:
        // Validation LaTeX basique
        if (!data.enonce.includes('$') && !data.enonce.includes('\\(')) {
          throw new BadRequestException('L\'énoncé doit contenir du LaTeX');
        }
        break;
    }
  }

  private performValidation(question: Question, userAnswer: string): { correct: boolean } {
    const normalizedUserAnswer = this.normalizeAnswer(userAnswer);
    const normalizedCorrectAnswer = this.normalizeAnswer(question.solution);

    switch (question.type) {
      case QuestionType.NUMERIQUE:
        return this.validateNumericAnswer(normalizedUserAnswer, normalizedCorrectAnswer, question.tolerance);
      
      case QuestionType.LATEX:
        return this.validateLatexAnswer(normalizedUserAnswer, normalizedCorrectAnswer);
      
      case QuestionType.QCM:
        return this.validateQcmAnswer(normalizedUserAnswer, normalizedCorrectAnswer);
      
      default:
        return { correct: false };
    }
  }

  private normalizeAnswer(answer: string): string {
    return answer.trim().replace(/\s+/g, ' ');
  }

  private validateNumericAnswer(userAnswer: string, correctAnswer: string, tolerance?: number): { correct: boolean } {
    const userNum = parseFloat(userAnswer);
    const correctNum = parseFloat(correctAnswer);
    
    if (isNaN(userNum) || isNaN(correctNum)) {
      return { correct: false };
    }

    if (tolerance) {
      return { correct: Math.abs(userNum - correctNum) <= tolerance };
    }

    // Tolérance par défaut pour les nombres
    return { correct: Math.abs(userNum - correctNum) <= 0.01 };
  }

  private validateLatexAnswer(userAnswer: string, correctAnswer: string): { correct: boolean } {
    // Normalisation LaTeX simple
    const normalizeLatex = (expr: string) => {
      return expr
        .replace(/\s+/g, '')
        .replace(/\*/g, '')
        .replace(/\(/g, '{')
        .replace(/\)/g, '}')
        .toLowerCase();
    };

    return {
      correct: normalizeLatex(userAnswer) === normalizeLatex(correctAnswer)
    };
  }

  private validateQcmAnswer(userAnswer: string, correctAnswer: string): { correct: boolean } {
    return {
      correct: userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    };
  }

  private generateExplication(question: Question, validation: { correct: boolean }): string {
    if (validation.correct) {
      return '✅ Bonne réponse !';
    }

    switch (question.type) {
      case QuestionType.NUMERIQUE:
        return `❌ Réponse incorrecte. La réponse attendue était : ${question.solution}`;
      
      case QuestionType.LATEX:
        return `❌ Réponse incorrecte. L'expression attendue était : ${question.solution}`;
      
      case QuestionType.QCM:
        return `❌ Réponse incorrecte. La bonne réponse était : ${question.solution}`;
      
      default:
        return '❌ Réponse incorrecte.';
    }
  }

  // Statistiques et utilitaires
  async getThemes(): Promise<string[]> {
    const themes = await this.prisma.question.findMany({
      select: { theme: true },
      distinct: ['theme'],
      orderBy: { theme: 'asc' },
    });

    return themes.map(t => t.theme);
  }

  async getStats(): Promise<{
    total: number;
    byType: Record<QuestionType, number>;
    byNiveau: Record<Categorie, number>;
    byDifficulte: Record<number, number>;
  }> {
    const [total, byType, byNiveau, byDifficulte] = await Promise.all([
      this.prisma.question.count(),
      this.prisma.question.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.question.groupBy({
        by: ['niveau'],
        _count: true,
      }),
      this.prisma.question.groupBy({
        by: ['difficulte'],
        _count: true,
      }),
    ]);

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<QuestionType, number>),
      byNiveau: byNiveau.reduce((acc, item) => {
        acc[item.niveau] = item._count;
        return acc;
      }, {} as Record<Categorie, number>),
      byDifficulte: byDifficulte.reduce((acc, item) => {
        acc[item.difficulte] = item._count;
        return acc;
      }, {} as Record<number, number>),
    };
  }
}
