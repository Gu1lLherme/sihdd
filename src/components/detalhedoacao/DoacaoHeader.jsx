import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { masks } from "@/components/Masks";

const statusConfig = {
  rascunho: { label: "Rascunho", color: "bg-slate-500" },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-amber-500" },
  concluido: { label: "Concluído", color: "bg-emerald-500" },
};

export default function DoacaoHeader({ doacao }) {
  if (!doacao) return null;
  
  const status = statusConfig[doacao.status] || statusConfig.rascunho;

  return (
    <Card className="p-6 border-none shadow-xl bg-gradient-to-r from-white to-blue-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Badge className={`${status.color} text-white border-none mb-2`}>
            {status.label}
          </Badge>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">
            Doação: {doacao.doador_nome} → {doacao.donatario_nome}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>Data da Doação</span>
          </div>
          <p className="text-lg font-semibold text-[#1e3a5f]">
            {doacao.data_doacao ? format(new Date(doacao.data_doacao), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <DollarSign className="w-4 h-4" />
            <span>Valor Total Bens</span>
          </div>
          <p className="text-lg font-semibold text-[#1e3a5f]">
            {masks.currency((doacao.valor_total_bens || 0) * 100)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <DollarSign className="w-4 h-4" />
            <span>ITCMD (4%)</span>
          </div>
          <p className="text-lg font-semibold text-amber-600">
             {masks.currency((doacao.valor_tributo || 0) * 100)}
          </p>
        </div>
      </div>
    </Card>
  );
}