import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Scale, Calculator, ArrowRight, Info } from "lucide-react";

const fmt = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

/**
 * Visualização dos 3 pilares do SIHDD:
 *   Dados do Cliente + Legislação = Resultado (ITCMD)
 * Deixa explícito ao usuário a base de cálculo líquida (após dívidas).
 */
export default function PilaresITCMD({ formData, resultadoPartilha }) {
  const totalBens = formData.bens.reduce((s, b) => s + (Number(b.valor) || 0), 0);
  const dividasPendentes = (formData.dividas || []).filter((d) => {
    const status = d.status || (d.pago ? "paga" : "pendente");
    return status === "pendente";
  });
  const totalDividas = dividasPendentes.reduce((s, d) => s + (Number(d.valor) || 0), 0);
  const monteMorLiquido = totalBens - totalDividas;

  const itcmd = resultadoPartilha?.resumo?.itcmd_total || formData.valor_itcmd || 0;
  const aliquota = formData.aliquota || 0;
  const dataObito = formData.data_obito
    ? new Date(formData.data_obito).toLocaleDateString("pt-BR")
    : "—";

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-5">
        <div className="flex items-start gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-700 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Como o ITCMD é calculado no SIHDD</h4>
            <p className="text-xs text-blue-700">
              Três pilares convergem para o valor final do imposto:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-stretch">
          {/* Pilar 1 — Dados do Cliente */}
          <div className="md:col-span-2 bg-white rounded-lg border border-blue-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Pilar 1</p>
                <p className="text-sm font-semibold text-blue-900">Dados do Cliente</p>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Patrimônio bruto:</span>
                <span className="font-medium">{fmt(totalBens)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">(−) Dívidas:</span>
                <span className="font-medium text-red-600">{fmt(totalDividas)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-700 font-semibold">Monte-mor líquido:</span>
                <span className="font-bold text-amber-700">{fmt(monteMorLiquido)}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="text-blue-600 text-xl font-light">+</div>
          </div>

          {/* Pilar 2 — Legislação */}
          <div className="md:col-span-2 bg-white rounded-lg border border-blue-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                <Scale className="w-4 h-4 text-indigo-700" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Pilar 2</p>
                <p className="text-sm font-semibold text-indigo-900">Legislação</p>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Data do óbito:</span>
                <span className="font-medium">{dataObito}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alíquota vigente:</span>
                <span className="font-medium">{aliquota}%</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 leading-tight">
                CTN art. 38 + regra estadual vigente na data do óbito (UFP + faixa progressiva)
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>

          {/* Pilar 3 — Resultado */}
          <div className="md:col-span-1 bg-blue-900 text-white rounded-lg p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4" />
              <p className="text-xs font-semibold">ITCMD Total</p>
            </div>
            <p className="text-lg font-bold leading-tight">{fmt(itcmd)}</p>
            <p className="text-[10px] opacity-75 mt-1">Base líquida × alíquota</p>
          </div>
        </div>

        <p className="text-[11px] text-blue-700 mt-3 italic">
          Fundamento: CTN art. 38 e Súmula 590/STF — o ITCMD incide sobre o monte-mor líquido
          (patrimônio menos dívidas exigíveis do espólio), nunca sobre a meação do cônjuge.
        </p>
      </CardContent>
    </Card>
  );
}