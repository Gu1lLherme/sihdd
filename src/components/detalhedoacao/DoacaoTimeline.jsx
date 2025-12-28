import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, FileText, Sparkles } from "lucide-react";

const STEPS = [
  { id: 'rascunho', label: 'Rascunho', icon: FileText, color: 'slate' },
  { id: 'aguardando_pagamento', label: 'Aguardando Pagamento', icon: Clock, color: 'amber' },
  { id: 'concluido', label: 'Concluído', icon: CheckCircle2, color: 'emerald' },
];

const colorMap = {
  slate: { bg: 'bg-slate-600', bgLight: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-600' },
  amber: { bg: 'bg-amber-600', bgLight: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-600' },
  emerald: { bg: 'bg-emerald-600', bgLight: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-600' },
};

export default function DoacaoTimeline({ status }) {
  const currentIndex = STEPS.findIndex(step => step.id === status);

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          Linha do Tempo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between relative">
           {/* Horizontal line for desktop */}
           <div className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-slate-200 z-0"></div>

          {STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            const colors = colorMap[step.color];
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 z-10 bg-white md:bg-transparent p-2 md:p-0">
                <div className="relative">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${isCompleted ? `${colors.bg} border-transparent shadow-lg` : ''}
                      ${isCurrent ? `${colors.bgLight} ${colors.border} shadow-xl animate-pulse scale-110` : ''}
                      ${isPending ? 'bg-slate-100 border-slate-300' : ''}
                    `}
                  >
                    <Icon 
                      className={`
                        w-5 h-5 transition-all duration-300
                        ${isCompleted ? 'text-white' : ''}
                        ${isCurrent ? colors.text : ''}
                        ${isPending ? 'text-slate-400' : ''}
                      `} 
                    />
                  </div>
                </div>

                <div className="md:text-center md:w-32">
                  <h4 className={`
                    font-semibold text-sm transition-colors duration-300
                    ${isCurrent ? colors.text : 'text-slate-600'}
                  `}>
                    {step.label}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isCompleted && 'Concluído'}
                    {isCurrent && 'Em andamento'}
                    {isPending && 'Pendente'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}