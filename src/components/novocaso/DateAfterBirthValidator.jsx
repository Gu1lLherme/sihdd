import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Valida se a data informada é posterior ou igual à data de nascimento do falecido.
 */
export default function DateAfterBirthValidator({ date, dataNascimento, label }) {
  if (!date || !dataNascimento) return null;

  const dateObj = new Date(date);
  const birthObj = new Date(dataNascimento);

  if (isNaN(dateObj.getTime()) || isNaN(birthObj.getTime())) return null;

  if (dateObj < birthObj) {
    return (
      <div className="flex items-center gap-1.5 mt-1">
        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <p className="text-xs text-red-500">
          {label || "Data"} não pode ser anterior à data de nascimento do falecido ({birthObj.toLocaleDateString("pt-BR")})
        </p>
      </div>
    );
  }

  return null;
}