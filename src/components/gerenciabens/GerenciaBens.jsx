import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Home, Car, Wallet, TrendingUp as TUp, Building2 } from "lucide-react";
import { toast } from "sonner";

import MovimentacaoForm from "./MovimentacaoForm";
import MovimentacaoList from "./MovimentacaoList";
import RelatorioConsolidado from "./RelatorioConsolidado";

const bemIcons = {
  imovel: Home,
  veiculo: Car,
  conta_bancaria: Wallet,
  investimento: TUp,
  empresa: Building2,
  outros: Package,
};

const fmt = (v) => `R$ ${Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function GerenciaBens({ casoId, bens, user }) {
  const queryClient = useQueryClient();
  const [bemFormAberto, setBemFormAberto] = useState(null); // id do bem com form aberto

  const { data: movimentacoes = [] } = useQuery({
    queryKey: ["movimentacoes-bem", casoId],
    queryFn: async () => {
      const all = await base44.entities.MovimentacaoBem.list("-data", 500);
      return all.filter((m) => m.caso_id === casoId);
    },
    enabled: !!casoId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MovimentacaoBem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimentacoes-bem", casoId] });
      setBemFormAberto(null);
      toast.success("Lançamento registrado com sucesso");
    },
    onError: () => toast.error("Erro ao registrar lançamento"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MovimentacaoBem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimentacoes-bem", casoId] });
      toast.success("Lançamento removido");
    },
  });

  const handleDelete = (id) => {
    if (confirm("Remover este lançamento?")) deleteMutation.mutate(id);
  };

  if (!bens || bens.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-300">
        <CardContent className="p-12 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Nenhum bem cadastrado neste inventário.</p>
          <p className="text-sm text-slate-400 mt-2">
            Adicione bens ao caso para começar a gerenciá-los.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <RelatorioConsolidado bens={bens} movimentacoes={movimentacoes} />

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-900" />
          Gerência por Bem
        </h3>

        {bens.map((bem) => {
          const Icon = bemIcons[bem.tipo] || Package;
          const movsDoBem = movimentacoes.filter((m) => m.bem_id === bem.id);
          const totalReceita = movsDoBem.filter((m) => m.tipo === "receita").reduce((s, m) => s + Number(m.valor || 0), 0);
          const totalDespesa = movsDoBem.filter((m) => m.tipo === "despesa").reduce((s, m) => s + Number(m.valor || 0), 0);
          const totalVenda = movsDoBem.filter((m) => m.tipo === "venda").reduce((s, m) => s + Number(m.valor || 0), 0);
          const formAberto = bemFormAberto === bem.id;

          return (
            <Card key={bem.id} className="border-slate-200">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{bem.descricao || "Sem descrição"}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs capitalize">{bem.tipo}</Badge>
                        <span className="text-xs text-slate-500">Valor base: {fmt(bem.valor)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-700">+{fmt(totalReceita + totalVenda)}</span>
                    <span className="text-red-700">-{fmt(totalDespesa)}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setBemFormAberto(formAberto ? null : bem.id)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {formAberto ? "Fechar" : "Lançamento"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {formAberto && (
                  <MovimentacaoForm
                    bem={bem}
                    casoId={casoId}
                    userEmail={user?.email}
                    onSave={(data) => createMutation.mutate(data)}
                    onCancel={() => setBemFormAberto(null)}
                  />
                )}

                <MovimentacaoList movimentacoes={movsDoBem} onDelete={handleDelete} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}