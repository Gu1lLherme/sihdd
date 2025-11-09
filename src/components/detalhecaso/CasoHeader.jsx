import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Percent, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  coleta_dados: { label: "Coleta de Dados", color: "bg-slate-500" },
  calculo_itcmd: { label: "Cálculo ITCMD", color: "bg-blue-500" },
  geracao_dae: { label: "Geração DAE", color: "bg-indigo-500" },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-amber-500" },
  em_analise_sefaz: { label: "Em Análise SEFAZ", color: "bg-yellow-500" },
  certidao_emitida: { label: "Certidão Emitida", color: "bg-green-500" },
  finalizado: { label: "Finalizado", color: "bg-emerald-500" },
};

export default function CasoHeader({ caso }) {
  const status = statusConfig[caso.status] || statusConfig.coleta_dados;

  return (
    <Card className="p-6 border-none shadow-xl bg-gradient-to-r from-white to-blue-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Badge className={`${status.color} text-white border-none mb-2`}>
            {status.label}
          </Badge>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">
            Caso #{caso.numero_caso || caso.id?.slice(0, 8)}
          </h2>
        </div>
        {caso.prazo_dias && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-lg">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900">
              {caso.prazo_dias} dias restantes
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>Data do Óbito</span>
          </div>
          <p className="text-lg font-semibold text-[#1e3a5f]">
            {caso.data_obito && format(new Date(caso.data_obito), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <DollarSign className="w-4 h-4" />
            <span>Patrimônio Total</span>
          </div>
          <p className="text-lg font-semibold text-[#1e3a5f]">
            {caso.valor_patrimonio?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Percent className="w-4 h-4" />
            <span>Alíquota</span>
          </div>
          <p className="text-lg font-semibold text-blue-600">
            {caso.aliquota || 4}%
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <DollarSign className="w-4 h-4" />
            <span>ITCMD Total</span>
          </div>
          <p className="text-lg font-semibold text-amber-600">
            {caso.valor_itcmd?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>

      {caso.observacoes && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Observações</h3>
          <p className="text-slate-700">{caso.observacoes}</p>
        </div>
      )}
    </Card>
  );
}