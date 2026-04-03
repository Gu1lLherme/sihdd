import React from "react";
import { AlertCircle } from "lucide-react";

export default function DateBeforeObitoValidator({ date, dataObito, label }) {
  if (!date || !dataObito) return null;

  const dateObj = new Date(date);
  const obitoObj = new Date(dataObito);

  if (isNaN(dateObj.getTime()) || isNaN(obitoObj.getTime())) return null;

  if (dateObj > obitoObj) {
    return (
      <div className="flex items-center gap-1.5 mt-1">
        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <p className="text-xs text-red-500">
          {label || "Data"} não pode ser posterior à data do óbito ({obitoObj.toLocaleDateString("pt-BR")})
        </p>
      </div>
    );
  }

  return null;
}