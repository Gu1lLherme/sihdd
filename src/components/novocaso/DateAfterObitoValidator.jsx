import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Valida que uma data NÃO é anterior à data de óbito.
 * Exibe alerta se date < dataObito.
 */
export default function DateAfterObitoValidator({ date, dataObito, label }) {
  if (!date || !dataObito) return null;

  const dateObj = new Date(date);
  const obitoObj = new Date(dataObito);

  if (isNaN(dateObj.getTime()) || isNaN(obitoObj.getTime())) return null;

  // A data deve ser estritamente posterior ao óbito (no mínimo 1 dia depois)
  const nextDay = new Date(obitoObj);
  nextDay.setDate(nextDay.getDate() + 1);

  if (dateObj < nextDay) {
    const minDateStr = nextDay.toLocaleDateString("pt-BR");
    return (
      <div className="flex items-center gap-1.5 mt-1">
        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <p className="text-xs text-red-500">
          {label || "Data"} deve ser posterior à data do óbito. Data mínima: {minDateStr}
        </p>
      </div>
    );
  }

  return null;
}