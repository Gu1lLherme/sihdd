import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Valida que uma data NÃO é futura (não pode ser > hoje).
 * Uso típico: Data do Óbito, Data de Emissão de Certidão, Data de Aquisição, etc.
 */
export default function DateFutureValidator({ date, label }) {
  if (!date) return null;

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (dateObj > today) {
    return (
      <div className="flex items-center gap-1.5 mt-1">
        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <p className="text-xs text-red-500">
          {label || "Data"} não pode ser futura. Uma pessoa não pode falecer ou um evento não pode ocorrer em data posterior a hoje.
        </p>
      </div>
    );
  }

  return null;
}