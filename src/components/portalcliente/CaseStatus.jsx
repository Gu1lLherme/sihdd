import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const statusConfig = {
  'coleta_dados': { label: 'Coleta de Dados', color: 'bg-blue-100 text-[#1E40AF]', progress: 15 },
  'calculo_itcmd': { label: 'Cálculo ITCMD', color: 'bg-purple-100 text-purple-700', progress: 30 },
  'geracao_dae': { label: 'Geração DAE', color: 'bg-amber-100 text-[#F59E0B]', progress: 45 },
  'aguardando_pagamento': { label: 'Aguardando Pagamento', color: 'bg-orange-100 text-orange-700', progress: 60 },
  'em_analise_sefaz': { label: 'Análise SEFAZ', color: 'bg-indigo-100 text-indigo-700', progress: 75 },
  'certidao_emitida': { label: 'Certidão Emitida', color: 'bg-emerald-100 text-[#10B981]', progress: 90 },
  'finalizado': { label: 'Finalizado', color: 'bg-green-100 text-green-700', progress: 100 },
};

export default function CaseStatus({ casos, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="glassmorphism border border-slate-200 animate-pulse">
            <CardContent className="p-8">
              <div className="h-32 bg-slate-200 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (casos.length === 0) {
    return (
      <Card className="glassmorphism border border-slate-200 card-shadow">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-[#111827] mb-2">
            Nenhum caso encontrado
          </h3>
          <p className="text-[#6B7280]">
            Você ainda não possui casos vinculados ao seu perfil.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {casos.map((caso, index) => {
        const status = statusConfig[caso.status] || statusConfig['coleta_dados'];
        
        return (
          <motion.div
            key={caso.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glassmorphism border-2 border-slate-200 card-shadow-hover group overflow-hidden">
              <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-[#0B1A2E] mb-2">
                      Inventário de {caso.nome_falecido}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Calendar className="w-4 h-4" />
                      <span>Criado em {new Date(caso.created_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <Badge className={`${status.color} border-2 font-bold text-sm px-4 py-2`}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                      Progresso do Processo
                    </p>
                    <span className="text-sm font-bold text-[#1E40AF]">
                      {status.progress}%
                    </span>
                  </div>
                  <Progress value={status.progress} className="h-3" />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-[#10B981]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#10B981]" />
                      <p className="text-xs font-bold text-[#10B981] uppercase tracking-wider">Patrimônio</p>
                    </div>
                    <p className="text-xl font-bold text-[#111827]">
                      R$ {(caso.valor_patrimonio || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">ITCMD</p>
                    </div>
                    <p className="text-xl font-bold text-[#111827]">
                      R$ {(caso.valor_itcmd || 0).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-[#F59E0B]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-[#F59E0B]" />
                      <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">Prazo</p>
                    </div>
                    <p className="text-xl font-bold text-[#111827]">
                      {caso.prazo_dias ? `${caso.prazo_dias} dias` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Observations */}
                {caso.observacoes && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider mb-2">
                      Observações do Advogado
                    </p>
                    <p className="text-sm text-[#111827]">
                      {caso.observacoes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}