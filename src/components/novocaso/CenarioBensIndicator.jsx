import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Info } from "lucide-react";
import { detectCenarioPartilha, descreverComportamentoConjuge } from "./detectCenarioHerdeiros";

const regimeLabels = {
  comunhao_parcial: "Comunhão Parcial",
  comunhao_universal: "Comunhão Universal",
  separacao_total: "Separação Convencional",
  separacao_obrigatoria: "Separação Obrigatória",
  participacao_final: "Participação Final nos Aquestos",
  uniao_estavel: "União Estável",
};

const cenarioColors = {
  A: "bg-emerald-50 border-emerald-300 text-emerald-900",
  B: "bg-amber-50 border-amber-300 text-amber-900",
  C: "bg-blue-50 border-blue-300 text-blue-900",
  NA: "bg-slate-50 border-slate-300 text-slate-700",
};

const fmt = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

/**
 * Indicador visual da Regra de Ouro (Art. 1.829, I, CC/02).
 * Detecta automaticamente o cenário (A/B/C) com base nos bens + regime.
 */
export default function CenarioBensIndicator({ formData }) {
  const temConjuge = !!(formData.conjuge_nome && formData.conjuge_nome.trim());

  const { cenario, totalComum, totalParticular, qtdComum, qtdParticular } = detectCenarioPartilha({
    bens: formData.bens || [],
    regimeBens: formData.regime_bens,
    dataCasamento: formData.data_casamento,
    temConjuge,
  });

  const desc = descreverComportamentoConjuge(formData.regime_bens, cenario);
  const colorClass = cenarioColors[cenario] || cenarioColors.NA;

  // Só exibe se há cônjuge e bens
  if (!temConjuge || (formData.bens || []).length === 0) return null;

  return (
    <Card className={`border-2 ${colorClass}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm">{desc.titulo}</p>
              <Badge variant="outline" className="text-xs">
                Regime: {regimeLabels[formData.regime_bens] || "—"}
              </Badge>
            </div>
            <p className="text-sm mt-1 opacity-90">{desc.descricao}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-current/20">
          <div>
            <p className="text-xs opacity-70">Bens Comuns</p>
            <p className="text-sm font-semibold">
              {qtdComum} {qtdComum === 1 ? "bem" : "bens"} • {fmt(totalComum)}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-70">Bens Particulares</p>
            <p className="text-sm font-semibold">
              {qtdParticular} {qtdParticular === 1 ? "bem" : "bens"} • {fmt(totalParticular)}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-70">Comportamento do Cônjuge</p>
            <p className="text-sm font-semibold">
              Meação: {desc.meacao} • Concorre: {desc.concorrencia}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2 border-t border-current/20 text-xs opacity-90">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>
            <b>Base de cálculo do ITCMD do cônjuge:</b> {desc.baseItcmd}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}