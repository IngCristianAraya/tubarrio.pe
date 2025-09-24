'use client';

import * as React from 'react';
const { useState } = React;
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({ redirectTo = '/admin' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { signIn: login, resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      
      // Redireccionar al panel de administración
      router.push(redirectTo);
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setShowForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar email de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recuperar Contraseña
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Ingresa tu email para recibir un enlace de recuperación
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Enviar Email'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Acceso Administrativo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Accede al panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Acceder al Admin'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>


      </div>
    </div>
  );
}