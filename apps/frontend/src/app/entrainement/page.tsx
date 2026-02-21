'use client';

import { useState, useEffect } from 'react';
import { useAuthenticatedGet } from '@/hooks/useAuthenticatedApi';
import { QuestionType, Categorie } from '@prisma/client';

// Types pour les questions
interface Question {
  id: string;
  enonce: string;
  type: QuestionType;
  theme: string;
  niveau: Categorie;
  difficulte: number;
  createdAt: string;
}

interface QuestionsResponse {
  questions: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function EntrainementPage() {
  const [filters, setFilters] = useState({
    theme: '',
    niveau: '' as Categorie | '',
    difficulte: '' as number | '',
    type: '' as QuestionType | '',
    page: 1,
    limit: 12,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [themes, setThemes] = useState<string[]>([]);

  const { get } = useAuthenticatedGet();

  // Charger les thèmes disponibles
  useEffect(() => {
    const loadThemes = async () => {
      try {
        const response = await get('/questions/themes/list');
        setThemes(response);
      } catch (error) {
        console.error('Erreur lors du chargement des thèmes:', error);
      }
    };

    loadThemes();
  }, [get]);

  // Charger les questions quand les filtres changent
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        
        // Ajouter les filtres non vides
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '' && value !== null) {
            queryParams.append(key, value.toString());
          }
        });

        const response = await get(`/questions?${queryParams.toString()}`) as QuestionsResponse;
        setQuestions(response.questions);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [filters, get]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Réinitialiser à la première page lors d'un changement de filtre
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
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

  const getDifficulteColor = (difficulte: number) => {
    if (difficulte <= 2) return 'text-succes';
    if (difficulte <= 4) return 'text-avertissement';
    return 'text-erreur';
  };

  return (
    <div className="min-h-screen bg-gris-50 py-8">
      <div className="container">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-h1 text-gris-900 mb-2">
            📚 Entraînement
          </h1>
          <p className="text-body text-gris-600">
            Entraînez-vous sur des exercices de mathématiques adaptés à votre niveau
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtres */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-h4 text-gris-900 mb-6">Filtres</h2>
              
              <div className="space-y-4">
                {/* Thème */}
                <div>
                  <label className="block text-sm font-medium text-gris-700 mb-2">
                    Thème
                  </label>
                  <select
                    value={filters.theme}
                    onChange={(e) => handleFilterChange('theme', e.target.value)}
                    className="input"
                  >
                    <option value="">Tous les thèmes</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Niveau */}
                <div>
                  <label className="block text-sm font-medium text-gris-700 mb-2">
                    Niveau
                  </label>
                  <select
                    value={filters.niveau}
                    onChange={(e) => handleFilterChange('niveau', e.target.value)}
                    className="input"
                  >
                    <option value="">Tous les niveaux</option>
                    <option value={Categorie.LYCEE}>Lycée</option>
                    <option value={Categorie.PREPA}>Prépa</option>
                    <option value={Categorie.UNIVERSITE}>Université</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gris-700 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="input"
                  >
                    <option value="">Tous les types</option>
                    <option value={QuestionType.NUMERIQUE}>Numérique</option>
                    <option value={QuestionType.LATEX}>LaTeX</option>
                    <option value={QuestionType.QCM}>QCM</option>
                  </select>
                </div>

                {/* Difficulté */}
                <div>
                  <label className="block text-sm font-medium text-gris-700 mb-2">
                    Difficulté
                  </label>
                  <select
                    value={filters.difficulte}
                    onChange={(e) => handleFilterChange('difficulte', parseInt(e.target.value))}
                    className="input"
                  >
                    <option value="">Toutes les difficultés</option>
                    <option value="1">1 - Très facile</option>
                    <option value="2">2 - Facile</option>
                    <option value="3">3 - Moyen</option>
                    <option value="4">4 - Difficile</option>
                    <option value="5">5 - Très difficile</option>
                  </select>
                </div>

                {/* Bouton de réinitialisation */}
                <button
                  onClick={() => setFilters({
                    theme: '',
                    niveau: '',
                    difficulte: '',
                    type: '',
                    page: 1,
                    limit: 12,
                  })}
                  className="btn btn-outline w-full"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Liste des questions */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bleu-nuit-600"></div>
                <p className="mt-4 text-body text-gris-600">Chargement des questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-h4 text-gris-900 mb-2">Aucune question trouvée</h3>
                <p className="text-body text-gris-600">
                  Essayez de modifier vos filtres pour voir plus de questions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="card hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-h4 text-gris-900 mb-2 line-clamp-2">
                          {question.theme}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-bleu-nuit-100 text-bleu-nuit-800 rounded-full text-xs">
                            {getNiveauLabel(question.niveau)}
                          </span>
                          <span className="px-2 py-1 bg-or-100 text-or-800 rounded-full text-xs">
                            {getTypeLabel(question.type)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficulteColor(question.difficulte)}`}>
                            {question.difficulte}/5
                          </span>
                        </div>
                      </div>
                      <div className="text-small text-gris-500">
                        {new Date(question.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {/* Énoncé */}
                    <div className="mb-4">
                      <div className="bg-gris-50 rounded-lg p-4 border border-gris-200">
                        <p className="text-body text-gris-800 leading-relaxed">
                          {question.enonce.length > 200 
                            ? `${question.enonce.substring(0, 200)}...`
                            : question.enonce
                          }
                        </p>
                      </div>
                    </div>

                    {/* Bouton d'action */}
                    <div className="flex justify-between items-center">
                      <div className="text-small text-gris-600">
                        Temps estimé : {question.difficulte * 2} minutes
                      </div>
                      <a
                        href={`/exercice/${question.id}`}
                        className="btn btn-primary text-sm"
                      >
                        Commencer l'exercice
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn btn-outline"
                >
                  Précédent
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i + 1;
                    const isActive = pageNum === pagination.page;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors duration-200 ${
                          isActive
                            ? 'bg-bleu-nuit-600 text-white'
                            : 'bg-white text-gris-700 hover:bg-gris-100'
                        }`}
                        disabled={pageNum > pagination.pages}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="btn btn-outline"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* Informations sur la pagination */}
            {questions.length > 0 && (
              <div className="text-center mt-6 text-small text-gris-600">
                Affichage de {questions.length} questions sur {pagination.total} 
                {pagination.total > pagination.limit && (
                  <> - Page {pagination.page} sur {pagination.pages}</>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
