import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, TrendingUp, TrendingDown, Banknote, Shield } from "lucide-react";

const tipoConfig = {
  receita: { label: "Receita", icon: TrendingUp, color: "text-green-700 bg-green-50 border-green-200" },
  despesa: { label: "Despesa", icon: TrendingDown, color: "text-red-700 bg-red-50 border-red-200" },
  venda: { label: "Venda", icon: Banknote, color: "text-amber-700 bg-amber-50 border-amber-200" },
  onus: { label: "Ônus", icon: Shield, color: "text-purple-700 bg-purple-50 border-purple-200" },
};

const fmt = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function MovimentacaoList({ movimentacoes, onDelete }) {
  if (!movimentacoes || movimentacoes.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        Nenhum lançamento registrado para este bem.
      </div>
    );
  }

  const ordenadas = [...movimentacoes].sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <div className="space-y-2">
      {ordenadas.map((m) => {
        const cfg = tipoConfig[m.tipo] || tipoConfig.despesa;
        const Icon = cfg.icon;
        return (
          <div key={m.id} className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.color}`}>
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{cfg.label}</Badge>
                {m.categoria && <span className="text-sm font-medium">{m.categoria}</span>}
                <span className="text-xs text-slate-500">
                  {new Date(m.data).toLocaleDateString("pt-BR")}
                </span>
              </div>
              {m.descricao && <p className="text-sm mt-1 text-slate-700">{m.descricao}</p>}
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                {m.responsavel && <span>Por: {m.responsavel}</span>}
                {m.comprador_nome && <span>Comprador: {m.comprador_nome}</span>}
                {m.onus_credor && <span>Credor: {m.onus_credor}</span>}
                {m.autorizacao_judicial && <span>Alvará: {m.autorizacao_judicial}</span>}
                {m.comprovante_url && (
                  <a
                    href={m.comprovante_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Comprovante
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-sm">{fmt(m.valor)}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(m.id)}
                className="h-7 w-7 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}