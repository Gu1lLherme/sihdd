import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const statusPagamento = {
  pendente: { label: "Pendente", color: "bg-amber-500", icon: Clock },
  pago: { label: "Pago", color: "bg-green-500", icon: CheckCircle2 },
  vencido: { label: "Vencido", color: "bg-red-500", icon: AlertCircle },
};

export default function GuiasDAE({ guias, herdeiros, isLoading }) {
  const getHerdeiroNome = (herdeiroId) => {
    const herdeiro = herdeiros.find(h => h.id === herdeiroId);
    return herdeiro?.nome || "Não identificado";
  };

  return (
    <Card className="p-6 border-none shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#1e3a5f]" />
          <h3 className="text-lg font-semibold text-[#1e3a5f]">
            Guias DAE ({guias.length})
          </h3>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : guias.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h4 className="text-lg font-semibold text-slate-700 mb-2">
            Nenhuma guia gerada
          </h4>
          <p className="text-slate-500 mb-4">
            As guias DAE serão geradas automaticamente após o cálculo do ITCMD
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {guias.map((guia) => {
            const statusInfo = statusPagamento[guia.status_pagamento] || statusPagamento.pendente;
            const StatusIcon = statusInfo.icon;

            return (
              <div key={guia.id} className="p-5 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-[#1e3a5f]">
                        {getHerdeiroNome(guia.herdeiro_id)}
                      </h4>
                      <Badge className={`${statusInfo.color} text-white border-none`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>Guia: <span className="font-medium">{guia.numero_guia}</span></p>
                      <p>Valor: <span className="font-semibold text-[#1e3a5f]">
                        {guia.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span></p>
                      <p>Vencimento: <span className="font-medium">
                        {guia.data_vencimento && new Date(guia.data_vencimento).toLocaleDateString('pt-BR')}
                      </span></p>
                      {guia.codigo_barras && (
                        <p className="font-mono text-xs bg-white p-2 rounded mt-2">
                          {guia.codigo_barras}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}