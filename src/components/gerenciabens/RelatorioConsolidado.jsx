import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Banknote, Shield, BarChart3 } from "lucide-react";

const fmt = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function RelatorioConsolidado({ bens, movimentacoes }) {
  // Totais gerais
  const totais = { receita: 0, despesa: 0, venda: 0, onus: 0 };
  movimentacoes.forEach((m) => {
    if (totais[m.tipo] !== undefined) totais[m.tipo] += Number(m.valor) || 0;
  });

  const saldoLiquido = totais.receita + totais.venda - totais.despesa;

  // Por bem
  const porBem = bens.map((b) => {
    const movs = movimentacoes.filter((m) => m.bem_id === b.id);
    const t = { receita: 0, despesa: 0, venda: 0, onus: 0 };
    movs.forEach((m) => { if (t[m.tipo] !== undefined) t[m.tipo] += Number(m.valor) || 0; });
    return {
      id: b.id,
      descricao: b.descricao,
      tipo: b.tipo,
      valor_base: b.valor,
      qtdLancamentos: movs.length,
      ...t,
      saldo: t.receita + t.venda - t.despesa,
    };
  });

  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-900" />
          Relatório Consolidado do Espólio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-1.5 text-xs text-green-700 mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Receitas
            </div>
            <p className="font-bold text-green-900">{fmt(totais.receita)}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-1.5 text-xs text-red-700 mb-1">
              <TrendingDown className="w-3.5 h-3.5" /> Despesas
            </div>
            <p className="font-bold text-red-900">{fmt(totais.despesa)}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 mb-1">
              <Banknote className="w-3.5 h-3.5" /> Vendas
            </div>
            <p className="font-bold text-amber-900">{fmt(totais.venda)}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-1.5 text-xs text-purple-700 mb-1">
              <Shield className="w-3.5 h-3.5" /> Ônus
            </div>
            <p className="font-bold text-purple-900">{fmt(totais.onus)}</p>
          </div>
          <div className={`p-3 rounded-lg border ${saldoLiquido >= 0 ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
            <div className={`text-xs mb-1 ${saldoLiquido >= 0 ? "text-blue-700" : "text-red-700"}`}>
              Saldo líquido
            </div>
            <p className={`font-bold ${saldoLiquido >= 0 ? "text-blue-900" : "text-red-900"}`}>
              {fmt(saldoLiquido)}
            </p>
          </div>
        </div>

        {/* Tabela por bem */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="py-2 pr-3">Bem</th>
                <th className="py-2 pr-3 text-right">Valor base</th>
                <th className="py-2 pr-3 text-right">Receitas</th>
                <th className="py-2 pr-3 text-right">Despesas</th>
                <th className="py-2 pr-3 text-right">Vendas</th>
                <th className="py-2 pr-3 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {porBem.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-400">Nenhum bem cadastrado.</td>
                </tr>
              ) : (
                porBem.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 truncate max-w-[240px]">{b.descricao || "—"}</td>
                    <td className="py-2 pr-3 text-right text-slate-600">{fmt(b.valor_base)}</td>
                    <td className="py-2 pr-3 text-right text-green-700">{fmt(b.receita)}</td>
                    <td className="py-2 pr-3 text-right text-red-700">{fmt(b.despesa)}</td>
                    <td className="py-2 pr-3 text-right text-amber-700">{fmt(b.venda)}</td>
                    <td className={`py-2 pr-3 text-right font-semibold ${b.saldo >= 0 ? "text-blue-900" : "text-red-900"}`}>
                      {fmt(b.saldo)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}