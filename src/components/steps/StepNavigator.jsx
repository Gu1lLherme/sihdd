import React from "react";

/**
 * Barra de navegação de etapas reutilizável.
 * 
 * Props:
 * - etapas: Array<{ id: number, titulo: string }>
 * - etapaAtual: number
 * - onNavigate: (etapaId: number) => void
 * - canNavigateTo?: (etapaId: number) => boolean
 * - colorClass?: string (ex: "blue-900", "purple-600") - classe base para cores
 * - sticky?: boolean - se deve ficar fixo ao rolar
 * - stickyTop?: string - classe CSS para posição top quando sticky (ex: "top-16")
 */
export default function StepNavigator({
  etapas,
  etapaAtual,
  onNavigate,
  canNavigateTo,
  colorClass = "blue-900",
  sticky = false,
  stickyTop = "top-16",
}) {
  const canGo = (etapaId) => {
    if (canNavigateTo) return canNavigateTo(etapaId);
    // Default: pode voltar livremente, avançar só 1 a mais
    return etapaId <= etapaAtual + 1;
  };

  const wrapperClasses = sticky
    ? `sticky ${stickyTop} z-40 bg-white border-b border-slate-200 shadow-sm`
    : "mb-8";

  return (
    <div className={wrapperClasses}>
      <div className={sticky ? "max-w-4xl mx-auto px-4 md:px-8 py-3 overflow-x-auto" : ""}>
        <div className={sticky ? "min-w-[700px]" : ""}>
          {/* Linha dos círculos + conectores */}
          <div className="flex items-center">
            {etapas.map((etapa, index) => {
              const isActive = etapaAtual === etapa.id;
              const isCompleted = etapaAtual > etapa.id;
              const isReachable = canGo(etapa.id);

              return (
                <React.Fragment key={etapa.id}>
                  <button
                    type="button"
                    onClick={() => isReachable && onNavigate(etapa.id)}
                    disabled={!isReachable}
                    className={`shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      isActive
                        ? `bg-${colorClass} text-white ring-4 ring-${colorClass}/20 scale-110`
                        : isCompleted
                        ? `bg-${colorClass} text-white hover:ring-2 hover:ring-${colorClass}/30`
                        : "bg-slate-200 text-slate-500"
                    } ${!isReachable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    {etapa.id}
                  </button>
                  {index < etapas.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-1 rounded transition-colors ${
                        etapaAtual > etapa.id ? `bg-${colorClass}` : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {/* Linha dos labels */}
          <div className="flex items-start mt-1">
            {etapas.map((etapa, index) => (
              <React.Fragment key={etapa.id}>
                <div className="shrink-0 w-8 md:w-9 flex justify-center">
                  <p
                    className={`text-[9px] md:text-[10px] font-medium text-center leading-tight transition-colors ${
                      etapaAtual >= etapa.id ? `text-${colorClass}` : "text-slate-400"
                    }`}
                    style={{ maxWidth: "52px" }}
                  >
                    {etapa.titulo}
                  </p>
                </div>
                {index < etapas.length - 1 && <div className="flex-1 mx-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}