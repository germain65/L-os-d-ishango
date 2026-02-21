import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';

// Hook pour faire des requêtes API authentifiées avec gestion automatique du refresh token
export function useAuthenticatedApi() {
  const { accessToken, refreshToken, refreshTokens } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const authenticatedRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    if (!accessToken) {
      throw new Error('Utilisateur non authentifié');
    }

    setIsLoading(true);

    try {
      return await apiClient.authenticatedRequest(endpoint, options, accessToken);
    } catch (error: any) {
      // Si l'erreur est 401 (Unauthorized), essayer de rafraîchir le token
      if (error.message.includes('401') && refreshToken) {
        try {
          await refreshTokens();
          // Réessayer la requête avec le nouveau token
          const newAccessToken = localStorage.getItem('accessToken');
          if (newAccessToken) {
            return await apiClient.authenticatedRequest(endpoint, options, newAccessToken);
          }
        } catch (refreshError) {
          // Si le refresh échoue, l'erreur sera gérée par le contexte
          throw refreshError;
        }
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, refreshToken, refreshTokens]);

  return {
    authenticatedRequest,
    isLoading,
  };
}

// Hook pour les requêtes GET authentifiées
export function useAuthenticatedGet() {
  const { authenticatedRequest } = useAuthenticatedApi();

  const get = useCallback(async (endpoint: string) => {
    return authenticatedRequest(endpoint, { method: 'GET' });
  }, [authenticatedRequest]);

  return { get };
}

// Hook pour les requêtes POST authentifiées
export function useAuthenticatedPost() {
  const { authenticatedRequest } = useAuthenticatedApi();

  const post = useCallback(async (endpoint: string, data?: any) => {
    return authenticatedRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [authenticatedRequest]);

  return { post };
}

// Hook pour les requêtes PUT authentifiées
export function useAuthenticatedPut() {
  const { authenticatedRequest } = useAuthenticatedApi();

  const put = useCallback(async (endpoint: string, data?: any) => {
    return authenticatedRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [authenticatedRequest]);

  return { put };
}

// Hook pour les requêtes DELETE authentifiées
export function useAuthenticatedDelete() {
  const { authenticatedRequest } = useAuthenticatedApi();

  const del = useCallback(async (endpoint: string) => {
    return authenticatedRequest(endpoint, { method: 'DELETE' });
  }, [authenticatedRequest]);

  return { delete: del };
}
