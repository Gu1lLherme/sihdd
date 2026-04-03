import React from "react";
import { Banknote, TrendingDown } from "lucide-react";
import RevisaoSection from "./RevisaoSection";

export default function RevisaoDividas({ formData, onNavigate }) {
  const dividas = formData.dividas || [];
  const total = dividas.reduce((s, d) => s + (Number(d.valor) || 0), 0);

  return (
    <RevisaoSection number={7} title={`Dívidas do Espólio (${dividas.length})`} icon={Banknote} onNavigate={() => onNavigate(7)}>
      {dividas.length === 0 ? (
        <p className="text-sm text-slate-400 italic py-2">Nenhuma dívida cadastrada</p>
      ) : (
        <div className="space-y-3">
          {dividas.map((d, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-6 text-center">#{d.numero || i + 1}</span>
                <div>
                  <p className="font-medium text-sm text-slate-900">{d.credor || d.titulo || "—"}</p>
                  {d.identificacao && <p className="text-xs text-slate-500 line-clamp-1">{d.identificacao}</p>}
                  <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                    {d.data_vencimento && <span>Venc: {d.data_vencimento}</span>}
                    {d.juros && <span>Juros: {d.juros}</span>}
                    {d.prazo_prescricional && <span>Prescrição: {d.prazo_prescricional}</span>}
                  </div>
                </div>
              </div>
              <span className="font-semibold text-red-600 whitespace-nowrap">
                R$ {(Number(d.valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200 mt-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Total de Dívidas</span>
            </div>
            <span className="text-2xl font-bold text-red-600">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </RevisaoSection>
  );
}