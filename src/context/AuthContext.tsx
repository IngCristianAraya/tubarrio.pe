'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  getAuth,
  Auth,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth as firebaseAuth, initializeFirebase } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

// Get auth instance with lazy initialization
const getAuthInstance = (): Auth | null => {
  if (typeof window === 'undefined') {
    console.log('Skipping Firebase Auth initialization during SSR');
    return null;
  }
  
  console.log('🔧 Initializing Firebase Auth...');
  
  try {
    // Log environment variables (redacted for security)
    console.log('🔧 Firebase Config:', {
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    });
    
    // Ensure Firebase is initialized
    console.log('🔧 Initializing Firebase...');
    initializeFirebase();
    
    // Get the Firebase Auth instance
    const authInstance = firebaseAuth?.instance;
    console.log('🔧 Firebase Auth instance:', authInstance ? '✅ Success' : '❌ Failed');
    
    return authInstance || null;
  } catch (error) {
    console.error('❌ Error initializing Firebase Auth:', error);
    return null;
  }
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  error: null,
  signIn: async () => { throw new Error('Auth context not initialized'); },
  signOut: async () => { throw new Error('Auth context not initialized'); },
  resetPassword: async () => { throw new Error('Auth context not initialized'); }
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const isAuthenticated = !!user;
  
  // Get auth instance with memoization
  const auth = useMemo(() => {
    if (typeof window === 'undefined') {
      console.log('Skipping Firebase Auth initialization during SSR');
      return null;
    }

    try {
      console.log('🔄 Getting Firebase Auth instance...');
      
      // Ensure Firebase is initialized first
      const { auth: firebaseAuth } = initializeFirebase();
      
      if (!firebaseAuth) {
        const error = new Error('Failed to initialize Firebase Auth');
        console.error('❌', error);
        setError(error);
        return null;
      }
      
      console.log('✅ Firebase Auth instance obtained successfully');
      setError(null);
      return firebaseAuth;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error initializing Firebase');
      console.error('❌ Error in AuthProvider:', error);
      setError(error);
      return null;
    }
  }, []);
  
  // Set up auth state listener
  useEffect(() => {
    if (!auth) {
      console.warn('⚠️ Auth instance not available in useEffect');
      setLoading(false);
      return;
    }
    
    console.log('👤 Setting up auth state observer...');
    setLoading(true);
    
    const handleAuthStateChanged = async (user: User | null) => {
      try {
        console.log('👤 Auth state changed:', user ? 'User signed in' : 'No user');
        setUser(user);
        
        // Additional debug info
        if (user) {
          console.log('🔍 User info:', {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            isAnonymous: user.isAnonymous
          });
          
          // Force token refresh to ensure valid session
          try {
            const idToken = await user.getIdToken(true);
            console.log('🔄 Refreshed ID token');
          } catch (tokenError) {
            console.warn('⚠️ Failed to refresh token:', tokenError);
          }
        }
      } catch (error) {
        console.error('❌ Error in auth state change handler:', error);
        setError(error instanceof Error ? error : new Error('Unknown auth error'));
      } finally {
        setLoading(false);
      }
    };
    
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged, (error) => {
      console.error('❌ Auth state observer error:', error);
      setError(error);
      setLoading(false);
    });
    
    return () => {
      console.log('👋 Cleaning up auth observer');
      unsubscribe();
    };
  }, [auth]);

  // Handle authentication state changes
  useEffect(() => {
    if (!auth) {
      console.warn('⚠️ Firebase Auth no está disponible');
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        
        // Verificar si el usuario es administrador
        if (user) {
          try {
            const idTokenResult = await user.getIdTokenResult();
            setIsAdmin(!!idTokenResult.claims.admin);
          } catch (error) {
            console.error('Error al verificar rol de administrador:', error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }, (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      setLoading(false);
    }
  }, [auth]);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string): Promise<User> => {
    console.log('🔐 Attempting to sign in with email:', email);
    
    if (!auth) {
      const errorMsg = 'Firebase Auth no está disponible';
      console.error('❌', errorMsg);
      toast.error('Error de autenticación. Por favor, intente de nuevo más tarde.');
      throw new Error(errorMsg);
    }

    try {
      console.log('🔑 Calling signInWithEmailAndPassword...');
      const userCredential = await firebaseSignIn(auth, email, password);
      console.log('✅ Sign in successful, user:', userCredential.user?.email);
      toast.success('Inicio de sesión exitoso');
      
      // Actualizar el estado de administrador después del inicio de sesión
      if (userCredential.user) {
        const idTokenResult = await userCredential.user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin);
      }
      
      return userCredential.user;
    } catch (error: any) {
      console.error('❌ Error during sign in:', {
        code: error.code,
        message: error.message,
        email,
        timestamp: new Date().toISOString()
      });
      
      let errorMessage = 'Error al iniciar sesión';
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Correo o contraseña incorrectos';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Por favor, intente más tarde.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Por favor, verifique su conexión a internet.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico no es válido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada';
          break;
        default:
          console.warn('Unhandled auth error code:', error.code);
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [auth]);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    if (!auth) {
      const errorMsg = 'Auth no está disponible';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    try {
      setLoading(true);
      console.log('🚪 Signing out...');
      await firebaseSignOut(auth);
      setIsAdmin(false);
      setUser(null);
      toast.success('Sesión cerrada correctamente');
      console.log('✅ Sign out successful');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error);
      const errorMsg = error.message || 'Error al cerrar sesión';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  // Reset password
  const resetPassword = useCallback(async (email: string): Promise<void> => {
    if (!auth) {
      const errorMsg = 'Firebase auth no está inicializado';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    try {
      console.log('📧 Sending password reset email to:', email);
      await firebaseSendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
      toast.success('Correo de recuperación enviado');
    } catch (error: any) {
      console.error('❌ Error al restablecer la contraseña:', error);
      
      let errorMessage = 'Error al enviar correo de recuperación';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No hay ninguna cuenta asociada a este correo electrónico';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido';
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, [auth]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    isAuthenticated,
    isAdmin,
    error,
    signIn,
    signOut,
    resetPassword,
  }), [user, loading, isAuthenticated, isAdmin, error, signIn, signOut, resetPassword]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

// Export the context and provider
export { AuthContext };
export default AuthContext;
