'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedGet } from '@/hooks/useAuthenticatedApi';

// Types pour les statistiques
interface UserStats {
  totalExercices: number;
  exercicesReussis: number;
  scoreMoyen: number;
  tempsMoyen: number;
  competitionsParticipees: number;
  meilleurePosition: number;
  categorie: string;
  dateInscription: string;
}

export default function ProfilPage() {
  const { user, logout } = useAuth();
  const { get } = useAuthenticatedGet();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Simuler des données pour l'instant (à remplacer par l'API réelle)
        const mockStats: UserStats = {
          totalExercices: 156,
          exercicesReussis: 134,
          scoreMoyen: 85.5,
          tempsMoyen: 245, // en secondes
          competitionsParticipees: 8,
          meilleurePosition: 3,
          categorie: user?.categorie || 'LYCEE',
          dateInscription: user?.createdAt || '',
        };
        
        setStats(mockStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user, get]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTemps = (secondes: number) => {
    const minutes = Math.floor(secondes / 60);
    const secs = secondes % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategorieLabel = (categorie: string) => {
    switch (categorie) {
      case 'LYCEE': return 'Lycée';
      case 'PREPA': return 'Prépa';
      case 'UNIVERSITE': return 'Université';
      default: return categorie;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gris-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-gris-600">Vous devez être connecté pour voir votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris-50 py-8">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-h1 text-gris-900 mb-2">Mon profil</h1>
            <p className="text-body text-gris-600">
              Gérez vos informations et consultez vos statistiques
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carte profil */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center">
                  <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-bleu-nuit-100 mb-4">
                    <span className="text-4xl">🦴</span>
                  </div>
                  
                  <h2 className="text-h3 text-gris-900 mb-1">{user.pseudo}</h2>
                  <p className="text-body text-gris-600 mb-4">{user.email}</p>
                  
                  <div className="space-y-2 text-small">
                    <div className="flex items-center justify-center">
                      <span className="text-gris-500">Catégorie :</span>
                      <span className="ml-2 px-2 py-1 bg-bleu-nuit-100 text-bleu-nuit-800 rounded-full text-xs font-medium">
                        {getCategorieLabel(user.categorie)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <span className="text-gris-500">Rôle :</span>
                      <span className="ml-2 px-2 py-1 bg-or-100 text-or-800 rounded-full text-xs font-medium">
                        {user.role === 'ADMIN' ? 'Administrateur' : 'Participant'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <span className="text-gris-500">Email vérifié :</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        user.emailVerified 
                          ? 'bg-succes/10 text-succes' 
                          : 'bg-avertissement/10 text-avertissement'
                      }`}>
                        {user.emailVerified ? '✓ Oui' : '✗ Non'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gris-200">
                    <p className="text-small text-gris-500 mb-4">
                      Inscrit le {formatDate(user.createdAt)}
                    </p>
                    
                    <button
                      onClick={() => logout()}
                      className="btn btn-outline w-full"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-h4 text-gris-900 mb-6">Mes statistiques</h3>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-body text-gris-600">Chargement des statistiques...</p>
                  </div>
                ) : error ? (
                  <div className="bg-erreur/10 border border-erreur text-erreur px-4 py-3 rounded-lg">
                    {error}
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Exercices */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gris-900">Exercices</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-small text-gris-600">Total tentés</span>
                          <span className="text-h4 text-bleu-nuit-600">{stats.totalExercices}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-small text-gris-600">Réussis</span>
                          <span className="text-h4 text-succes">{stats.exercicesReussis}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-small text-gris-600">Taux de réussite</span>
                          <span className="text-h4 text-or-500">
                            {((stats.exercicesReussis / stats.totalExercices) * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-small text-gris-600">Score moyen</span>
                          <span className="text-h4 text-bleu-nuit-600">{stats.scoreMoyen.toFixed(1)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-small text-gris-600">Temps moyen</span>
                          <span className="text-h4 text-gris-700">{formatTemps(stats.tempsMoyen)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compétitions */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gris-900">Compétitions</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-small text-gris-600">Participations</span>
                          <span className="text-h4 text-bleu-nuit-600">{stats.competitionsParticipees}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-small text-gris-600">Meilleure position</span>
                          <span className="text-h4 text-or-500">
                            {stats.meilleurePosition === 0 ? '-' : `${stats.meilleurePosition}${stats.meilleurePosition === 1 ? 'er' : 'ème'}`}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-small text-gris-600">Catégorie actuelle</span>
                          <span className="px-2 py-1 bg-bleu-nuit-100 text-bleu-nuit-800 rounded-full text-xs font-medium">
                            {getCategorieLabel(stats.categorie)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Actions rapides */}
              <div className="card mt-6">
                <h3 className="text-h4 text-gris-900 mb-4">Actions rapides</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="btn btn-primary text-left">
                    📊 Voir l'historique complet
                  </button>
                  
                  <button className="btn btn-secondary text-left">
                    🎯 S'entraîner sur des exercices
                  </button>
                  
                  <button className="btn btn-outline text-left">
                    🏆 Consulter les compétitions
                  </button>
                  
                  <button className="btn btn-outline text-left">
                    ⚙️ Modifier mes préférences
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
