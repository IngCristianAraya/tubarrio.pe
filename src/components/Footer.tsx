'use client';

import React from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center sm:text-left">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4 justify-center sm:justify-start">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold">Revista Pando</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md mx-auto sm:mx-0 text-center sm:text-left">
              Conectamos a las personas con los mejores servicios locales de su zona. 
              Descubre, conecta y apoya a los emprendedores de tu comunidad.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/#servicios" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/#categorias" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/#cobertura" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Cobertura
                </Link>
              </li>
              <li>
                <Link href="/#registro" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Registrar Negocio
                </Link>
              </li>
              <li>
                <Link href="/#revista" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">
                  Catálogo Digital
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 justify-center sm:justify-start">
                <Mail className="w-5 h-5 text-orange-400" />
                <span>info@revistapando.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 justify-center sm:justify-start">
                <Phone className="w-5 h-5 text-orange-400" />
                <span>906684284</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 justify-center sm:justify-start">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span>Lima, Perú</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} <a href="https://creciendodigitalweb.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Creciendo digital</a>. Todos los derechos reservados.
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 mt-4 md:mt-0 items-center">
            <Link href="/terminos-condiciones" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm text-center">
              Términos y Condiciones
            </Link>
            <Link href="/politica-privacidad" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm text-center">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
