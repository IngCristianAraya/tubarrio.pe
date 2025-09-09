'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth';
import { app } from '@/lib/firebase/config';

// Inicializar auth solo si la app de Firebase está disponible
const auth = app ? getAuth(app) : null;
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  // Handle authentication state changes
  useEffect(() => {
    if (!auth) {
      console.warn('⚠️ Firebase Auth no está disponible');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      if (!auth) {
        throw new Error('Firebase Auth no está inicializado. Por favor, verifica tu conexión.');
      }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      if (!auth) throw new Error('Firebase auth not initialized');
      await firebaseSignOut(auth);
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      if (!auth) throw new Error('Firebase auth not initialized');
      await sendPasswordResetEmail(auth, email);
      toast.success('Correo de recuperación enviado');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error al enviar correo de recuperación');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the context and provider
export { AuthContext };
export default AuthContext;
