import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'L\'Os d\'Ishango - Plateforme de mathématiques en ligne',
  description: 'Entraînez-vous aux mathématiques et participez à des compétitions chronométrées. Pour lycéens, prépa et universitaires.',
  openGraph: {
    title: 'L\'Os d\'Ishango - Plateforme de mathématiques',
    description: 'Entraînez-vous aux mathématiques et participez à des compétitions chronométrées',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'L\'Os d\'Ishango - Plateforme de mathématiques',
    description: 'Entraînez-vous aux mathématiques et participez à des compétitions chronométrées',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gris-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bleu-nuit-900 via-bleu-nuit-800 to-bleu-nuit-700">
        {/* Pattern de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-20">
            {/* Contenu texte */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              {/* Logo et nom */}
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="w-16 h-16 bg-or-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🦴</span>
                </div>
                <h1 className="text-h1 font-bold text-white">
                  L&apos;Os d&apos;Ishango
                </h1>
              </div>

              {/* Slogan */}
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-or-400 leading-tight">
                  Maîtrisez les mathématiques<br />
                  <span className="text-white">par la pratique</span>
                </h2>
                <p className="text-xl text-gris-200 leading-relaxed max-w-2xl">
                  La plateforme de compétitions mathématiques conçue pour les lycéens, 
                  étudiants en prépa et à l&apos;université. Entraînez-vous, 
                  progressez, et défiez les meilleurs.
                </p>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-3 gap-6 py-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-or-400">1500+</div>
                  <div className="text-sm text-gris-300">Exercices</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-or-400">50+</div>
                  <div className="text-sm text-gris-300">Compétitions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-or-400">95%</div>
                  <div className="text-sm text-gris-300">Satisfaction</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/inscription"
                  className="btn bg-or-500 text-gris-900 hover:bg-or-600 px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Commencer gratuitement
                </Link>
                <Link 
                  href="/connexion"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-bleu-nuit-900 px-8 py-4 text-lg font-semibold transition-all duration-200"
                >
                  Se connecter
                </Link>
              </div>
            </div>

            {/* Illustration / Visuel */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                {/* Formule mathématique décorative */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                  <div className="text-center space-y-6">
                    <div className="text-4xl font-mono text-white">
                      ∫₀^∞ e^(-x²) dx = √π/2
                    </div>
                    <div className="text-xl text-gris-300">
                      Intégrale de Gauss
                    </div>
                    <div className="flex justify-center space-x-2">
                      <span className="px-3 py-1 bg-or-500/20 text-or-400 rounded-full text-sm">
                        Analyse
                      </span>
                      <span className="px-3 py-1 bg-bleu-nuit-600/30 text-gris-300 rounded-full text-sm">
                        Difficile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Éléments décoratifs */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-or-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-bleu-nuit-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" 
                  fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Section Prochaines compétitions */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gris-900 mb-4">
              Prochaines compétitions
            </h2>
            <p className="text-body text-gris-600 max-w-2xl mx-auto">
              Ne manquez pas les compétitions à venir. Testez vos compétences et défiez d'autres participants !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Compétition 1 */}
            <div className="card border-l-4 border-bleu-nuit-600 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-h4 text-gris-900 mb-1">Olympiades d'Algèbre</h3>
                  <p className="text-small text-gris-600">Niveau : Lycée</p>
                </div>
                <span className="px-3 py-1 bg-bleu-nuit-100 text-bleu-nuit-800 rounded-full text-xs font-medium">
                  Bientôt
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">📅</span>
                  Samedi 25 mars 2024
                </div>
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">⏰</span>
                  14h00 - 16h00
                </div>
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">👥</span>
                  45 participants inscrits
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-small text-or-600 font-medium">
                  🏆 Prix : 150€
                </div>
                <button className="btn btn-primary text-sm px-4 py-2">
                  S'inscrire
                </button>
              </div>
            </div>

            {/* Compétition 2 */}
            <div className="card border-l-4 border-or-500 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-h4 text-gris-900 mb-1">Défi de Calcul</h3>
                  <p className="text-small text-gris-600">Niveau : Prépa</p>
                </div>
                <span className="px-3 py-1 bg-or-100 text-or-800 rounded-full text-xs font-medium">
                  Ouvert
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">📅</span>
                  Dimanche 26 mars 2024
                </div>
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">⏰</span>
                  10h00 - 12h00
                </div>
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">👥</span>
                  28 participants inscrits
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-small text-or-600 font-medium">
                  🏆 Prix : 100€
                </div>
                <button className="btn btn-secondary text-sm px-4 py-2">
                  S'inscrire
                </button>
              </div>
            </div>

            {/* Compétition 3 */}
            <div className="card border-l-4 border-succes hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-h4 text-gris-900 mb-1">Géométrie Avancée</h3>
                  <p className="text-small text-gris-600">Niveau : Université</p>
                </div>
                <span className="px-3 py-1 bg-succes/10 text-succes rounded-full text-xs font-medium">
                  Nouveau
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">📅</span>
                  Mercredi 29 mars 2024
                </div>
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">⏰</span>
                  18h00 - 20h00
                </div>
                <div className="flex items-center text-small text-gris-600">
                  <span className="mr-2">👥</span>
                  12 participants inscrits
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-small text-or-600 font-medium">
                  🏆 Prix : 200€
                </div>
                <button className="btn btn-outline text-sm px-4 py-2">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/competitions"
              className="btn btn-outline px-8 py-3"
            >
              Voir toutes les compétitions →
            </Link>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-20 bg-gris-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-gris-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-body text-gris-600 max-w-2xl mx-auto">
              Devenez un expert en mathématiques en 3 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="relative">
              <div className="text-center">
                {/* Numéro de l'étape */}
                <div className="relative inline-block mb-8">
                  <div className="w-16 h-16 bg-bleu-nuit-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    1
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-bleu-nuit-200 -z-10"></div>
                </div>

                {/* Icône */}
                <div className="w-24 h-24 bg-bleu-nuit-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📝</span>
                </div>

                {/* Contenu */}
                <h3 className="text-h4 text-gris-900 mb-4">Inscrivez-vous</h3>
                <p className="text-body text-gris-600 mb-6">
                  Créez votre compte gratuitement en quelques secondes. 
                  Choisissez votre catégorie (Lycée, Prépa ou Université) 
                  et vérifiez votre email.
                </p>
                
                {/* Points clés */}
                <ul className="text-left space-y-2 text-small text-gris-600">
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Inscription gratuite
                  </li>
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Accès immédiat aux exercices
                  </li>
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Pas de carte de crédit
                  </li>
                </ul>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="relative">
              <div className="text-center">
                {/* Numéro de l'étape */}
                <div className="relative inline-block mb-8">
                  <div className="w-16 h-16 bg-bleu-nuit-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    2
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-bleu-nuit-200 -z-10"></div>
                </div>

                {/* Icône */}
                <div className="w-24 h-24 bg-or-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🧮</span>
                </div>

                {/* Contenu */}
                <h3 className="text-h4 text-gris-900 mb-4">Entraînez-vous</h3>
                <p className="text-body text-gris-600 mb-6">
                  Accédez à plus de 1500 exercices couvrant tous les niveaux. 
                  Entraînez-vous à votre rythme et suivez votre progression.
                </p>
                
                {/* Points clés */}
                <ul className="text-left space-y-2 text-small text-gris-600">
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Exercices adaptés à votre niveau
                  </li>
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Corrections détaillées
                  </li>
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Suivi des performances
                  </li>
                </ul>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="relative">
              <div className="text-center">
                {/* Numéro de l'étape */}
                <div className="relative inline-block mb-8">
                  <div className="w-16 h-16 bg-bleu-nuit-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    3
                  </div>
                </div>

                {/* Icône */}
                <div className="w-24 h-24 bg-or-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🏆</span>
                </div>

                {/* Contenu */}
                <h3 className="text-h4 text-gris-900 mb-4">Défiez les autres</h3>
                <p className="text-body text-gris-600 mb-6">
                  Participez à des compétitions chronométrées et affrontez 
                  d'autres étudiants. Montrez vos talents et gagnez des récompenses !
                </p>
                
                {/* Points clés */}
                <ul className="text-left space-y-2 text-small text-gris-600">
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Compétitions hebdomadaires
                  </li>
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Classements en temps réel
                  </li>
                  <li className="flex items-center">
                    <span className="text-succes mr-2">✓</span>
                    Prix et récompenses
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gris-200">
              <h3 className="text-h4 text-gris-900 mb-4">
                Prêt à commencer votre aventure mathématique ?
              </h3>
              <p className="text-body text-gris-600 mb-6">
                Rejoignez des milliers d'étudiants qui progressent chaque jour.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/inscription"
                  className="btn btn-primary px-8 py-3"
                >
                  Commencer maintenant
                </Link>
                <Link 
                  href="/exercices"
                  className="btn btn-outline px-8 py-3"
                >
                  Voir les exercices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section preview des autres sections (temporaire) */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-gris-900 mb-4">
              Rejoignez une communauté passionnée
            </h2>
            <p className="text-body text-gris-600 max-w-2xl mx-auto">
              Des milliers d&apos;élèves et d&apos;étudiants s&apos;entraînent chaque jour 
              pour progresser en mathématiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-bleu-nuit-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-h4 text-gris-900 mb-2">Précision</h3>
              <p className="text-body text-gris-600">
                Exercices conçus par des professeurs pour couvrir tous les niveaux
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-or-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-h4 text-gris-900 mb-2">Vitesse</h3>
              <p className="text-body text-gris-600">
                Compétitions chronométrées pour développer vos réflexes
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-succes/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-h4 text-gris-900 mb-2">Excellence</h3>
              <p className="text-body text-gris-600">
                Classements et récompenses pour motiver votre progression
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
