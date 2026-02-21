'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { apiClient } from '@/lib/api/client';

export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Récupérer les messages de l'URL (ex: ?success=email_verified)
  const urlSuccess = searchParams.get('success');
  const urlError = searchParams.get('error');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Afficher les messages de l'URL au chargement
  useState(() => {
    if (urlSuccess === 'email_verified') {
      setSuccess('Email vérifié avec succès ! Vous pouvez maintenant vous connecter.');
    }
    if (urlError === 'invalid_token') {
      setError('Le lien de vérification est invalide ou a expiré.');
    }
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(data);
      
      // Stocker les tokens dans localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      setSuccess('Connexion réussie ! Redirection...');
      
      // Rediriger vers le tableau de bord après 1 seconde
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      
      // Messages d'erreur personnalisés
      if (errorMessage.includes('Email ou mot de passe incorrect')) {
        setError('Email ou mot de passe incorrect');
      } else if (errorMessage.includes('Email non vérifié')) {
        setError('Veuillez vérifier votre email avant de vous connecter');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gris-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-bleu-nuit-100">
            <span className="text-2xl">🦴</span>
          </div>
          <h1 className="mt-6 text-h1 text-gris-900">
            Se connecter
          </h1>
          <p className="mt-2 text-body text-gris-600">
            Accédez à votre espace d&apos;entraînement mathématique
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-erreur/10 border border-erreur text-erreur px-4 py-3 rounded-lg animate-fade-in">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-succes/10 border border-succes text-succes px-4 py-3 rounded-lg animate-fade-in">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gris-700 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="votre@email.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gris-700 mb-1">
                Mot de passe
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-error">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-bleu-nuit-600 focus:ring-bleu-nuit-500 border-gris-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gris-700">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  href="/mot-de-passe-oublie" 
                  className="font-medium text-bleu-nuit-600 hover:text-bleu-nuit-700"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-small text-gris-600">
              Pas encore de compte ?{' '}
              <Link 
                href="/inscription" 
                className="font-medium text-bleu-nuit-600 hover:text-bleu-nuit-700"
              >
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="text-center">
          <p className="text-small text-gris-500">
            En vous connectant, vous acceptez nos{' '}
            <Link href="/conditions" className="text-bleu-nuit-600 hover:text-bleu-nuit-700">
              conditions d&apos;utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="/confidentialite" className="text-bleu-nuit-600 hover:text-bleu-nuit-700">
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
