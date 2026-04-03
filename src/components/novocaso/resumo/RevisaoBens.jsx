import React from "react";
import { Home, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RevisaoSection from "./RevisaoSection";

const TIPO_BEM = {
  imovel: "Imóvel", veiculo: "Veículo", conta_bancaria: "Conta Bancária",
  investimento: "Investimento", empresa: "Empresa", outros: "Outros"
};
const ORIGEM = { onerosa: "Compra", doacao: "Doação", heranca: "Herança" };

export default function RevisaoBens({ formData, onNavigate }) {
  const bens = formData.bens || [];
  const total = bens.reduce((s, b) => s + (Number(b.valor) || 0), 0);

  return (
    <RevisaoSection number={7} title={`Bens do Espólio (${bens.length})`} icon={Home} onNavigate={() => onNavigate(7)}>
      {bens.length === 0 ? (
        <p className="text-sm text-slate-400 italic py-2">Nenhum bem cadastrado</p>
      ) : (
        <div className="space-y-3">
          {bens.map((b, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                  <span className="font-medium text-sm text-slate-900 line-clamp-1">{b.descricao || "—"}</span>
                  <Badge variant="outline" className="text-xs">{TIPO_BEM[b.tipo] || b.tipo}</Badge>
                  <Badge variant="secondary" className="text-xs">{ORIGEM[b.origem_bem] || b.origem_bem}</Badge>
                  {b.tipo === 'imovel' && (
                    <Badge variant={b.imovel_regular === false ? 'destructive' : 'outline'} className="text-xs">
                      {b.imovel_regular === false ? 'Irregular' : 'Regular'}
                    </Badge>
                  )}
                </div>
                <span className="font-semibold text-emerald-600 whitespace-nowrap">
                  R$ {(Number(b.valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-xs text-slate-500 mt-2">
                {b.identificacao && <span>Matrícula: {b.identificacao}</span>}
                {b.data_aquisicao && <span>Aquisição: {b.data_aquisicao}</span>}
                {b.municipio_bem && <span>Município: {b.municipio_bem}</span>}
                {b.cartorio_registro && <span>Cartório: {b.cartorio_registro}</span>}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200 mt-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">Patrimônio Total</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </RevisaoSection>
  );
}