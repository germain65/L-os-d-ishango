'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gris-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-gris-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris-50 py-8">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-h1 text-gris-900 mb-2">
              Bienvenue, {user.pseudo} ! 👋
            </h1>
            <p className="text-body text-gris-600">
              Prêt à relever des défis mathématiques ?
            </p>
          </div>

          {/* Cartes principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* S'entraîner */}
            <Link href="/entrainement" className="card hover:shadow-lg transition-shadow duration-200 group">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-bleu-nuit-100 mb-4 group-hover:bg-bleu-nuit-200 transition-colors">
                  <span className="text-3xl">🧮</span>
                </div>
                <h3 className="text-h4 text-gris-900 mb-2">S&apos;entraîner</h3>
                <p className="text-body text-gris-600">
                  Entraînez-vous sur des exercices de mathématiques adaptés à votre niveau
                </p>
              </div>
            </Link>

            {/* Compétitions */}
            <Link href="/competitions" className="card hover:shadow-lg transition-shadow duration-200 group">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-or-100 mb-4 group-hover:bg-or-200 transition-colors">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-h4 text-gris-900 mb-2">Compétitions</h3>
                <p className="text-body text-gris-600">
                  Participez à des compétitions chronométrées et défiez d&apos;autres joueurs
                </p>
              </div>
            </Link>

            {/* Profil */}
            <Link href="/profil" className="card hover:shadow-lg transition-shadow duration-200 group">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gris-100 mb-4 group-hover:bg-gris-200 transition-colors">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-h4 text-gris-900 mb-2">Mon profil</h3>
                <p className="text-body text-gris-600">
                  Consultez vos statistiques et gérez vos informations
                </p>
              </div>
            </Link>
          </div>

          {/* Statistiques rapides */}
          <div className="card mb-8">
            <h2 className="text-h3 text-gris-900 mb-6">Vos statistiques</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-bleu-nuit-600 mb-1">156</div>
                <div className="text-small text-gris-600">Exercices tentés</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-succes mb-1">134</div>
                <div className="text-small text-gris-600">Exercices réussis</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-or-500 mb-1">85.5%</div>
                <div className="text-small text-gris-600">Taux de réussite</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gris-700 mb-1">8</div>
                <div className="text-small text-gris-600">Compétitions</div>
              </div>
            </div>
          </div>

          {/* Compétitions récentes */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-h3 text-gris-900">Compétitions récentes</h2>
              <Link href="/competitions" className="text-bleu-nuit-600 hover:text-bleu-nuit-700 font-medium">
                Voir tout →
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gris-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gris-900">Défi d&apos;algèbre</h3>
                  <p className="text-small text-gris-600">Terminé le 15 mars 2024</p>
                </div>
                <div className="text-right">
                  <div className="text-h4 text-or-500">3ème</div>
                  <div className="text-small text-gris-600">/ 45 participants</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gris-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gris-900">Olympiades de calcul</h3>
                  <p className="text-small text-gris-600">Terminé le 10 mars 2024</p>
                </div>
                <div className="text-right">
                  <div className="text-h4 text-bleu-nuit-600">7ème</div>
                  <div className="text-small text-gris-600">/ 62 participants</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gris-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gris-900">Géométrie rapide</h3>
                  <p className="text-small text-gris-600">En cours</p>
                </div>
                <div className="text-right">
                  <div className="text-small text-or-500">Phase 2/4</div>
                  <div className="text-small text-gris-600">2 jours restants</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
