'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  pseudo: string;
  categorie: 'LYCEE' | 'PREPA' | 'UNIVERSITE';
  role: 'ADMIN' | 'PARTICIPANT';
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: (logoutAll?: boolean) => Promise<void>;
  refreshTokens: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

// Valeur initiale du contexte
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
};

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider du contexte
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Fonction pour mettre à jour l'état
  const updateState = (updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Fonction pour nettoyer l'état d'authentification
  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    updateState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  };

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      
      // Mettre à jour l'état
      updateState({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Stocker dans localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Rediriger vers le dashboard
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = async (logoutAll = false) => {
    try {
      if (state.refreshToken) {
        await apiClient.logout(state.refreshToken, logoutAll);
      }
    } catch (error) {
      // Continuer même si l'API échoue
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      clearAuth();
      router.push('/connexion');
    }
  };

  // Fonction pour rafraîchir les tokens
  const refreshTokens = async () => {
    if (!state.refreshToken) {
      throw new Error('Pas de refresh token disponible');
    }

    try {
      const response = await apiClient.refreshToken(state.refreshToken);
      
      updateState({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    } catch (error) {
      // Si le refresh échoue, déconnecter l'utilisateur
      clearAuth();
      router.push('/connexion');
      throw error;
    }
  };

  // Fonction pour mettre à jour les informations utilisateur
  const updateUser = (updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      updateState({ user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Initialisation au montage du composant
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');

        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr);
          updateState({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          updateState({ isLoading: false });
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        clearAuth();
        updateState({ isLoading: false });
      }
    };

    initializeAuth();
  }, []);

  // Vérifier périodiquement la validité du token
  useEffect(() => {
    if (!state.accessToken || !state.refreshToken) return;

    const checkTokenValidity = () => {
      try {
        // Décoder le JWT pour vérifier l'expiration
        const payload = JSON.parse(atob(state.accessToken.split('.')[1]));
        const now = Date.now() / 1000;
        
        // Si le token expire dans moins de 5 minutes, le rafraîchir
        if (payload.exp - now < 300) {
          refreshTokens();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
      }
    };

    // Vérifier immédiatement
    checkTokenValidity();

    // Puis vérifier toutes les 4 minutes
    const interval = setInterval(checkTokenValidity, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.accessToken, state.refreshToken]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshTokens,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}

// Hook pour vérifier si l'utilisateur est admin
export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === 'ADMIN';
}

// Hook pour obtenir la catégorie de l'utilisateur
export function useUserCategory() {
  const { user } = useAuth();
  return user?.categorie;
}
