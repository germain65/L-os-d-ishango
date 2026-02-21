// Types partagés pour L'Os d'Ishango

export enum Role {
  ADMIN = 'ADMIN',
  PARTICIPANT = 'PARTICIPANT'
}

export enum Categorie {
  LYCEE = 'LYCEE',
  PREPA = 'PREPA',
  UNIVERSITE = 'UNIVERSITE'
}

export enum QuestionType {
  NUMERIQUE = 'NUMERIQUE',
  LATEX = 'LATEX',
  QCM = 'QCM'
}

export enum PhaseType {
  ELIMINATOIRE = 'ELIMINATOIRE',
  QUARTS = 'QUARTS',
  DEMIS = 'DEMIS',
  FINALE = 'FINALE'
}

export enum CompetitionStatut {
  BROUILLON = 'BROUILLON',
  OUVERTE = 'OUVERTE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ARCHIVEE = 'ARCHIVEE'
}

export enum SessionStatut {
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ABANDON = 'ABANDON'
}

// Types de base
export interface User {
  id: string
  email: string
  pseudo: string
  categorie: Categorie
  role: Role
  emailVerified: boolean
  createdAt: Date
}

export interface Question {
  id: string
  enonce: string
  solution: string
  type: QuestionType
  theme: string
  niveau: Categorie
  difficulte: number
  options?: any
  tolerance?: number
  createdAt: Date
}

export interface Competition {
  id: string
  titre: string
  description?: string
  statut: CompetitionStatut
  categorie: Categorie
  startsAt: Date
  endsAt: Date
  createdAt: Date
}

export interface Phase {
  id: string
  competitionId: string
  type: PhaseType
  ordre: number
  dureeParQuestion: number
  createdAt: Date
}

export interface CompetitionSession {
  id: string
  userId: string
  competitionId: string
  phaseActuelle: PhaseType
  startedAt: Date
  endedAt?: Date
  statut: SessionStatut
}

export interface Submission {
  id: string
  sessionId: string
  questionId: string
  reponse?: string
  correct?: boolean
  points: number
  tempsMs: number
  soumisAt: Date
}

// DTOs pour API
export interface CreateUserDto {
  email: string
  pseudo: string
  password: string
  categorie: Categorie
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: Omit<User, 'passwordHash'>
}

export interface CreateQuestionDto {
  enonce: string
  solution: string
  type: QuestionType
  theme: string
  niveau: Categorie
  difficulte: number
  options?: any
  tolerance?: number
}

export interface CreateCompetitionDto {
  titre: string
  description?: string
  categorie: Categorie
  startsAt: Date
  endsAt: Date
  phases: Omit<Phase, 'id' | 'competitionId' | 'createdAt'>[]
}

export interface SubmitAnswerDto {
  questionId: string
  reponse: string
}

// Constantes
export const DUREE_PHASES = {
  [PhaseType.ELIMINATOIRE]: 120, // 2 minutes
  [PhaseType.QUARTS]: 180,       // 3 minutes
  [PhaseType.DEMIS]: 240,        // 4 minutes
  [PhaseType.FINALE]: 900        // 15 minutes
} as const

export const POINTS_PAR_BONNE_REPONSE = 1

export const TOLERANCE_NUMERIQUE_DEFAUT = 0.01

export const RATE_LIMITS = {
  GLOBAL: { ttl: 60, limit: 100 },
  COMPETITION: { ttl: 60, limit: 10 }
} as const
