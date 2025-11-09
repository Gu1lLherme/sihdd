import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Calendar, DollarSign, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  rascunho: { label: "Rascunho", color: "bg-slate-100 text-slate-700 border-slate-300" },
  coleta_dados: { label: "Coleta de Dados", color: "bg-slate-100 text-slate-700 border-slate-300" },
  calculo_itcmd: { label: "Cálculo ITCMD", color: "bg-blue-100 text-blue-700 border-blue-300" },
  geracao_dae: { label: "Geração DAE", color: "bg-indigo-100 text-indigo-700 border-indigo-300" },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-amber-100 text-amber-700 border-amber-300" },
  em_analise_sefaz: { label: "Em Análise SEFAZ", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  certidao_emitida: { label: "Certidão Emitida", color: "bg-green-100 text-green-700 border-green-300" },
  finalizado: { label: "Finalizado", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  em_analise: { label: "Em Análise na SEFAZ", color: "bg-amber-100 text-amber-700 border-amber-300" },
  pago: { label: "Pago", color: "bg-blue-100 text-blue-700 border-blue-300" },
  concluido: { label: "Concluído", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
};

export default function CasoCard({ caso }) {
  if (!caso) return null;
  
  const status = statusConfig[caso.status] || statusConfig.coleta_dados;

  return (
    <Card className="border-slate-200 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-slate-50">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Inventário — {caso.nome_falecido || caso.falecido_nome || 'Nome não informado'}
                </h3>
                <Badge variant="outline" className={`${status.color} border font-medium`}>
                  {status.label}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Patrimônio</p>
                  <p className="font-semibold text-slate-900">
                    R$ {((caso.valor_patrimonio || caso.patrimonio_total) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">ITCMD Estimado</p>
                  <p className="font-semibold text-slate-900">
                    R$ {((caso.valor_itcmd || caso.itcmd_total) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Prazo</p>
                  <p className="font-semibold text-slate-900">{caso.prazo_dias || 30} dias</p>
                </div>
              </div>
            </div>
          </div>

          <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
            <Button className="bg-blue-900 hover:bg-blue-800 text-white shadow-md">
              Acompanhar Processo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}