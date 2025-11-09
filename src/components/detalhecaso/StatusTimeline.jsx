import React from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const steps = [
  { id: "coleta_dados", label: "Coleta de Dados" },
  { id: "calculo_itcmd", label: "Cálculo ITCMD" },
  { id: "geracao_dae", label: "Geração DAE" },
  { id: "aguardando_pagamento", label: "Aguardando Pagamento" },
  { id: "em_analise_sefaz", label: "Em Análise SEFAZ" },
  { id: "certidao_emitida", label: "Certidão Emitida" },
  { id: "finalizado", label: "Finalizado" },
];

export default function StatusTimeline({ status }) {
  const currentIndex = steps.findIndex(s => s.id === status);

  return (
    <Card className="p-6 border-none shadow-lg">
      <h3 className="text-lg font-semibold text-[#1e3a5f] mb-6">
        Linha do Tempo do Processo
      </h3>
      
      <div className="relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.id} className="flex items-start mb-8 last:mb-0">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : isCurrent ? (
                    <Clock className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-white" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-1 h-12 transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
              
              <div className="flex-1 pb-8">
                <h4 className={`font-semibold ${
                  isCompleted ? 'text-green-700' : isCurrent ? 'text-amber-700' : 'text-slate-500'
                }`}>
                  {step.label}
                </h4>
                <p className={`text-sm mt-1 ${
                  isCompleted ? 'text-green-600' : isCurrent ? 'text-amber-600' : 'text-slate-400'
                }`}>
                  {isCompleted ? 'Concluído' : isCurrent ? 'Em andamento' : 'Pendente'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}