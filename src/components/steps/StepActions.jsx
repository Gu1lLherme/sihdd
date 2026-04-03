import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Home, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * Botões de ação para navegação entre etapas.
 * 
 * Props:
 * - etapaAtual: number
 * - totalEtapas: number
 * - onAvancar: () => void
 * - onVoltar: () => void
 * - onSalvar: () => void
 * - isSaving: boolean
 * - isSaved?: boolean
 * - isEditing?: boolean
 * - saveLabel?: string (ex: "Salvar Caso", "Salvar Doação")
 * - nextColorClass?: string (ex: "bg-blue-900 hover:bg-blue-800")
 * - dashboardPath?: string
 * - extraActions?: React.ReactNode - botões extras ao lado do salvar
 */
export default function StepActions({
  etapaAtual,
  totalEtapas,
  onAvancar,
  onVoltar,
  onSalvar,
  isSaving = false,
  isSaved = false,
  isEditing = false,
  saveLabel = "Salvar",
  nextColorClass = "bg-blue-900 hover:bg-blue-800",
  dashboardPath = "Dashboard",
  extraActions,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onVoltar}
          disabled={etapaAtual === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl(dashboardPath))}
          className="text-slate-600 hover:text-slate-800"
        >
          <Home className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {/* Ações extras (ex: Gerar Guia) */}
        {etapaAtual === totalEtapas && extraActions}

        {etapaAtual < totalEtapas ? (
          <Button
            onClick={onAvancar}
            className={`${nextColorClass} text-white`}
          >
            Próximo
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onSalvar}
            disabled={isSaving || isSaved}
            className={isSaved ? "bg-emerald-700 text-white cursor-default" : "bg-green-600 hover:bg-green-700 text-white"}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : isSaved ? `${saveLabel} ✓` : saveLabel}
          </Button>
        )}
      </div>
    </div>
  );
}