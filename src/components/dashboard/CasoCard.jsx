import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusConfig = {
  coleta_dados: { label: "Coleta de Dados", color: "bg-slate-500", emoji: "📝" },
  calculo_itcmd: { label: "Cálculo ITCMD", color: "bg-blue-500", emoji: "🧮" },
  geracao_dae: { label: "Geração DAE", color: "bg-indigo-500", emoji: "📄" },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-amber-500", emoji: "⏳" },
  em_analise_sefaz: { label: "Em Análise SEFAZ", color: "bg-yellow-500", emoji: "🔍" },
  certidao_emitida: { label: "Certidão Emitida", color: "bg-green-500", emoji: "✅" },
  finalizado: { label: "Finalizado", color: "bg-emerald-500", emoji: "🎉" },
};

export default function CasoCard({ caso }) {
  const status = statusConfig[caso.status] || statusConfig.coleta_dados;

  return (
    <Card className="bg-white border-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${status.color === 'bg-slate-500' ? 'from-slate-400 to-slate-600' : status.color === 'bg-blue-500' ? 'from-blue-400 to-blue-600' : status.color === 'bg-amber-500' ? 'from-amber-400 to-amber-600' : status.color === 'bg-green-500' ? 'from-green-400 to-green-600' : 'from-emerald-400 to-emerald-600'}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{status.emoji}</span>
              <h3 className="text-xl font-bold text-[#1e3a5f]">
                Inventário — {caso.nome_falecido}
              </h3>
            </div>
            <Badge className={`${status.color} text-white border-none`}>
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Valor Patrimonial
            </p>
            <p className="text-lg font-bold text-[#1e3a5f] flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {caso.valor_patrimonio?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              ITCMD Estimado
            </p>
            <p className="text-lg font-bold text-amber-600">
              {caso.valor_itcmd?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'A calcular'}
            </p>
          </div>
        </div>

        {caso.prazo_dias && (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>Prazo: <span className="font-semibold">{caso.prazo_dias} dias</span></span>
          </div>
        )}

        <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
          <Button className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] hover:from-[#2d5a8f] hover:to-[#1e3a5f] text-white shadow-md hover:shadow-lg transition-all duration-300">
            Acompanhar Processo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}