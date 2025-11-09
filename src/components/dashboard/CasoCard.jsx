import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Calendar, TrendingUp, Clock } from "lucide-react";

const statusConfig = {
  'coleta_dados': { label: 'Coleta de Dados', color: 'bg-blue-100 text-[#4169E1] border-[#4169E1]' },
  'calculo_itcmd': { label: 'Cálculo ITCMD', color: 'bg-amber-100 text-[#FFC107] border-[#FFC107]' },
  'geracao_dae': { label: 'Geração DAE', color: 'bg-amber-100 text-[#FFD700] border-[#FFD700]' },
  'aguardando_pagamento': { label: 'Aguardando Pagamento', color: 'bg-orange-100 text-orange-700 border-orange-700' },
  'em_analise_sefaz': { label: 'Análise SEFAZ', color: 'bg-indigo-100 text-[#4169E1] border-[#4169E1]' },
  'certidao_emitida': { label: 'Certidão Emitida', color: 'bg-emerald-100 text-[#10B981] border-[#10B981]' },
  'finalizado': { label: 'Finalizado', color: 'bg-green-100 text-green-700 border-green-700' },
};

export default function CasoCard({ caso }) {
  const status = statusConfig[caso.status] || statusConfig['coleta_dados'];

  return (
    <Card className="glassmorphism border-2 border-[#4169E1]/20 card-shadow-hover group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-amber-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="border-b border-slate-200 pb-3 sm:pb-4 p-4 sm:p-6 relative">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-[#1A237E] mb-2 group-hover:text-[#4169E1] transition-colors line-clamp-2">
              {caso.nome_falecido}
            </CardTitle>
            <Badge variant="outline" className={`${status.color} border-2 font-bold text-xs sm:text-sm`}>
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 space-y-3 sm:space-y-4 relative">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg sm:rounded-xl border-2 border-[#FFD700]/30 ring-1 ring-[#FFD700]/20">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFD700]" />
              <p className="text-[10px] sm:text-xs font-bold text-[#FFC107] uppercase tracking-wider">Patrimônio</p>
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-extrabold text-[#FFD700] break-words">
              R$ {(caso.valor_patrimonio || 0).toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg sm:rounded-xl border-2 border-[#FFD700]/30 ring-1 ring-[#FFD700]/20">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFD700]" />
              <p className="text-[10px] sm:text-xs font-bold text-[#FFC107] uppercase tracking-wider">ITCMD</p>
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-extrabold text-[#FFD700] break-words">
              R$ {(caso.valor_itcmd || 0).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {caso.prazo_dias && (
          <div className="flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[#4169E1]/20 rounded-lg sm:rounded-xl">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#4169E1] flex-shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-[#1A237E]">
              {caso.prazo_dias} dias restantes
            </p>
          </div>
        )}

        <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
          <Button className="w-full bg-gradient-to-r from-[#4169E1] to-[#FFD700] hover:from-[#5a7bea] hover:to-[#ffd700] text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 font-bold text-xs sm:text-sm h-10 sm:h-11">
            Acompanhar Processo
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}