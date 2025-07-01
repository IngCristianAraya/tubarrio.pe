"use client";

/**
 * EmptyState
 * Componente visual para mostrar un estado vacío o sin resultados.
 * Se utiliza cuando una búsqueda, filtro o listado no tiene datos para mostrar.
 * Ayuda a dar feedback claro y amigable al usuario, evitando una pantalla en blanco.
 *
 * Props:
 * - message: mensaje personalizado a mostrar debajo del título
 *
 * Uso típico: en páginas de servicios, catálogos o cualquier sección donde puede no haber datos.
 */
import { AlertCircle } from "lucide-react";

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {/* Ícono ilustrativo */}
    <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
    {/* Título */}
    <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">No hay resultados</h2>
    {/* Mensaje personalizado */}
    <p className="text-gray-500 max-w-md mx-auto">{message}</p>
  </div>
);

export default EmptyState;
