import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * Cabeçalho para páginas de fato jurídico.
 * 
 * Props:
 * - titulo: string
 * - subtitulo?: string
 * - backPath: string (página para voltar)
 * - colorClass?: string (ex: "text-blue-900")
 * - rightContent?: React.ReactNode (conteúdo extra à direita)
 */
export default function StepHeader({ titulo, subtitulo, backPath, colorClass = "text-blue-900", rightContent }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(createPageUrl(backPath))}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className={`text-3xl font-bold ${colorClass}`}>{titulo}</h1>
          {subtitulo && <p className="text-slate-600 mt-1">{subtitulo}</p>}
        </div>
      </div>
      {rightContent}
    </div>
  );
}