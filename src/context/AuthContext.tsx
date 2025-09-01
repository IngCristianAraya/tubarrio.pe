'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Simplificado: cualquier usuario autenticado es considerado admin
      // Las reglas de Firestore ya protegen los datos sensibles
      setIsAdmin(!!user);
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase Auth no está disponible');
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('¡Bienvenido!');
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejar errores específicos
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Usuario no encontrado');
        case 'auth/wrong-password':
          throw new Error('Contraseña incorrecta');
        case 'auth/invalid-email':
          throw new Error('Email inválido');
        case 'auth/user-disabled':
          throw new Error('Usuario deshabilitado');
        case 'auth/too-many-requests':
          throw new Error('Demasiados intentos. Intenta más tarde');
        default:
          throw new Error('Error al iniciar sesión');
      }
    }
  };



  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase Auth no está disponible');
    }
    
    try {
      await signOut(auth);
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Error en logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      throw new Error('Firebase Auth no está disponible');
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de recuperación enviado');
    } catch (error: any) {
      console.error('Error en reset password:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Usuario no encontrado');
        case 'auth/invalid-email':
          throw new Error('Email inválido');
        default:
          throw new Error('Error al enviar email de recuperación');
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    resetPassword,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}