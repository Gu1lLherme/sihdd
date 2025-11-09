import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Calendar, TrendingUp, Clock } from "lucide-react";

const statusConfig = {
  'coleta_dados': { label: 'Coleta de Dados', color: 'bg-blue-100 text-[#1E40AF] border-[#1E40AF]' },
  'calculo_itcmd': { label: 'Cálculo ITCMD', color: 'bg-purple-100 text-purple-700 border-purple-700' },
  'geracao_dae': { label: 'Geração DAE', color: 'bg-amber-100 text-[#F59E0B] border-[#F59E0B]' },
  'aguardando_pagamento': { label: 'Aguardando Pagamento', color: 'bg-orange-100 text-orange-700 border-orange-700' },
  'em_analise_sefaz': { label: 'Análise SEFAZ', color: 'bg-indigo-100 text-indigo-700 border-indigo-700' },
  'certidao_emitida': { label: 'Certidão Emitida', color: 'bg-emerald-100 text-[#10B981] border-[#10B981]' },
  'finalizado': { label: 'Finalizado', color: 'bg-green-100 text-green-700 border-green-700' },
};

export default function CasoCard({ caso }) {
  const status = statusConfig[caso.status] || statusConfig['coleta_dados'];

  return (
    <Card className="glassmorphism border border-slate-200 card-shadow-hover group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="border-b border-slate-200 pb-3 sm:pb-4 p-4 sm:p-6 relative">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-[#0B1A2E] mb-2 group-hover:text-[#1E40AF] transition-colors line-clamp-2">
              {caso.nome_falecido}
            </CardTitle>
            <Badge variant="outline" className={`${status.color} border-2 font-semibold text-xs sm:text-sm`}>
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 space-y-3 sm:space-y-4 relative">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg sm:rounded-xl border-2 border-[#10B981]/20">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#10B981]" />
              <p className="text-[10px] sm:text-xs font-bold text-[#10B981] uppercase tracking-wider">Patrimônio</p>
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-[#111827] break-words">
              R$ {(caso.valor_patrimonio || 0).toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-purple-500/20">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <p className="text-[10px] sm:text-xs font-bold text-purple-600 uppercase tracking-wider">ITCMD</p>
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-[#111827] break-words">
              R$ {(caso.valor_itcmd || 0).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {caso.prazo_dias && (
          <div className="flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#F59E0B]/20 rounded-lg sm:rounded-xl">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#F59E0B] flex-shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-[#111827]">
              {caso.prazo_dias} dias restantes
            </p>
          </div>
        )}

        <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
          <Button className="w-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 font-semibold text-xs sm:text-sm h-10 sm:h-11">
            Acompanhar Processo
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}