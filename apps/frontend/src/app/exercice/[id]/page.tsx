'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthenticatedGet, useAuthenticatedPost } from '@/hooks/useAuthenticatedApi';
import { QuestionType, Categorie } from '@prisma/client';

// Types pour l'exercice
interface Question {
  id: string;
  enonce: string;
  solution: string;
  type: QuestionType;
  theme: string;
  niveau: Categorie;
  difficulte: number;
  tolerance?: number;
  options?: string[];
}

interface AttemptResponse {
  correct: boolean;
  points: number;
  solution?: string;
  explication?: string;
}

export default function ExercicePage() {
  const params = useParams();
  const router = useRouter();
  const { get } = useAuthenticatedGet();
  const { post } = useAuthenticatedPost();

  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Charger la question
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const response = await get(`/questions/${params.id}`) as Question;
        setQuestion(response);
        setStartTime(Date.now());
      } catch (error) {
        console.error('Erreur lors du chargement de la question:', error);
        router.push('/entrainement');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestion();
  }, [params.id, get, router]);

  // Timer
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) {
      alert('Veuillez fournir une réponse');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await post(`/questions/${params.id}/attempt`, {
        reponse: userAnswer.trim(),
        tempsMs: Date.now() - (startTime || Date.now()),
      }) as AttemptResponse;

      setResult(response);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Une erreur est survenue lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.NUMERIQUE: return 'Numérique';
      case QuestionType.LATEX: return 'LaTeX';
      case QuestionType.QCM: return 'QCM';
      default: return type;
    }
  };

  const getNiveauLabel = (niveau: Categorie) => {
    switch (niveau) {
      case Categorie.LYCEE: return 'Lycée';
      case Categorie.PREPA: return 'Prépa';
      case Categorie.UNIVERSITE: return 'Université';
      default: return niveau;
    }
  };

  const renderInput = () => {
    if (!question) return null;

    switch (question.type) {
      case QuestionType.NUMERIQUE:
        return (
          <input
            type="number"
            step="any"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="input text-lg"
            placeholder="Entrez votre réponse numérique"
            disabled={isSubmitting || result !== null}
          />
        );

      case QuestionType.LATEX:
        return (
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="input text-lg font-mono min-h-[120px]"
            placeholder="Entrez votre expression LaTeX (ex: x^2 + 2x + 1)"
            disabled={isSubmitting || result !== null}
          />
        );

      case QuestionType.QCM:
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="qcm-answer"
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-4 h-4 text-bleu-nuit-600"
                  disabled={isSubmitting || result !== null}
                />
                <span className="text-body text-gris-800">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="input text-lg"
            placeholder="Entrez votre réponse"
            disabled={isSubmitting || result !== null}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gris-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bleu-nuit-600"></div>
          <p className="mt-4 text-body text-gris-600">Chargement de l'exercice...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gris-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-gris-600">Question non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris-50 py-8">
      <div className="container max-w-4xl">
        {/* En-tête avec informations */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h2 text-gris-900 mb-2">📝 Exercice</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-bleu-nuit-100 text-bleu-nuit-800 rounded-full text-sm">
                  {getNiveauLabel(question.niveau)}
                </span>
                <span className="px-3 py-1 bg-or-100 text-or-800 rounded-full text-sm">
                  {getTypeLabel(question.type)}
                </span>
                <span className="px-3 py-1 bg-gris-200 text-gris-700 rounded-full text-sm">
                  Difficulté {question.difficulte}/5
                </span>
              </div>
            </div>
            
            {/* Timer */}
            <div className="text-right">
              <div className="text-h3 text-bleu-nuit-600 mb-1">
                ⏱️ {formatTime(elapsedTime)}
              </div>
              <div className="text-small text-gris-600">
                Temps estimé : {question.difficulte * 2} min
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Énoncé */}
          <div>
            <div className="card">
              <h2 className="text-h4 text-gris-900 mb-4">Énoncé</h2>
              <div className="bg-white rounded-lg p-6 border border-gris-200">
                <div className="prose max-w-none">
                  {question.type === QuestionType.LATEX ? (
                    <div className="text-lg font-mono text-gris-800 leading-relaxed">
                      {question.enonce}
                    </div>
                  ) : (
                    <p className="text-lg text-gris-800 leading-relaxed">
                      {question.enonce}
                    </p>
                  )}
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-6 p-4 bg-gris-50 rounded-lg">
                <h3 className="text-h4 text-gris-900 mb-3">Informations</h3>
                <div className="space-y-2 text-small text-gris-600">
                  <div>📚 Thème : {question.theme}</div>
                  {question.type === QuestionType.NUMERIQUE && question.tolerance && (
                    <div>🎯 Tolérance : ±{question.tolerance}</div>
                  )}
                  <div>⭐ Difficulté : {question.difficulte}/5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de réponse */}
          <div>
            <div className="card">
              <h2 className="text-h4 text-gris-900 mb-4">Votre réponse</h2>
              
              {result ? (
                // Afficher le résultat
                <div className={`p-6 rounded-lg border-2 ${
                  result.correct 
                    ? 'bg-succes/10 border-succes text-succes' 
                    : 'bg-erreur/10 border-erreur text-erreur'
                }`}>
                  <div className="text-center">
                    <div className="text-2xl mb-3">
                      {result.correct ? '✅' : '❌'}
                    </div>
                    <h3 className="text-h4 mb-2">
                      {result.correct ? 'Bonne réponse !' : 'Réponse incorrecte'}
                    </h3>
                    <p className="text-body mb-4">
                      {result.explication}
                    </p>
                    {result.solution && (
                      <div className="mt-4 p-4 bg-white rounded border border-gris-200">
                        <p className="text-small text-gris-600 mb-2">Solution correcte :</p>
                        <div className="text-body font-mono text-gris-800">
                          {result.solution}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Formulaire de réponse
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderInput()}
                  
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => router.push('/entrainement')}
                      className="btn btn-outline"
                    >
                      Retour à la liste
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !userAnswer.trim()}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? 'Vérification...' : 'Soumettre'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/entrainement')}
            className="btn btn-outline"
          >
            📚 Autres exercices
          </button>
          
          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
          >
            🖨️ Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}
