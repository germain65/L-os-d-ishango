'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { apiClient } from '@/lib/api/client';

export default function InscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiClient.register(data);
      setSuccess('Inscription réussie ! Un email de vérification vous a été envoyé.');
      reset();
      setTimeout(() => {
        router.push('/connexion');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
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
            Créer un compte
          </h1>
          <p className="mt-2 text-body text-gris-600">
            Rejoignez L&apos;Os d&apos;Ishango pour vous entraîner aux mathématiques
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-erreur/10 border border-erreur text-erreur px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-succes/10 border border-succes text-succes px-4 py-3 rounded-lg">
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
              />
              {errors.email && (
                <p className="text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="pseudo" className="block text-sm font-medium text-gris-700 mb-1">
                Pseudo
              </label>
              <input
                {...register('pseudo')}
                type="text"
                id="pseudo"
                className={`input ${errors.pseudo ? 'input-error' : ''}`}
                placeholder="pseudo123"
                disabled={isLoading}
              />
              {errors.pseudo && (
                <p className="text-error">{errors.pseudo.message}</p>
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
              />
              {errors.password && (
                <p className="text-error">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="categorie" className="block text-sm font-medium text-gris-700 mb-1">
                Catégorie
              </label>
              <select
                {...register('categorie')}
                id="categorie"
                className={`input ${errors.categorie ? 'input-error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="LYCEE">Lycée</option>
                <option value="PREPA">Prépa</option>
                <option value="UNIVERSITE">Université</option>
              </select>
              {errors.categorie && (
                <p className="text-error">{errors.categorie.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-small text-gris-600">
              Déjà un compte ?{' '}
              <Link 
                href="/connexion" 
                className="font-medium text-bleu-nuit-600 hover:text-bleu-nuit-700"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
