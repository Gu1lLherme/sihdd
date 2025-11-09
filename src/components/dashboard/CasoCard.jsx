import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Calendar, TrendingUp, Clock } from "lucide-react";

const statusConfig = {
  'coleta_dados': { label: 'Coleta de Dados', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'calculo_itcmd': { label: 'Cálculo ITCMD', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'geracao_dae': { label: 'Geração DAE', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'aguardando_pagamento': { label: 'Aguardando Pagamento', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  'em_analise_sefaz': { label: 'Análise SEFAZ', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  'certidao_emitida': { label: 'Certidão Emitida', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'finalizado': { label: 'Finalizado', color: 'bg-green-100 text-green-700 border-green-200' },
};

export default function CasoCard({ caso }) {
  const status = statusConfig[caso.status] || statusConfig['coleta_dados'];

  return (
    <Card className="border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="border-b border-slate-100 pb-4 relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-600 transition-colors">
              {caso.nome_falecido}
            </CardTitle>
            <Badge variant="outline" className={`${status.color} border font-medium`}>
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4 relative">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-medium text-emerald-700">Patrimônio</p>
            </div>
            <p className="text-lg font-bold text-emerald-900">
              R$ {(caso.valor_patrimonio || 0).toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-medium text-purple-700">ITCMD</p>
            </div>
            <p className="text-lg font-bold text-purple-900">
              R$ {(caso.valor_itcmd || 0).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {caso.prazo_dias && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Clock className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-medium text-amber-900">
              {caso.prazo_dias} dias restantes
            </p>
          </div>
        )}

        <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            Acompanhar Processo
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}