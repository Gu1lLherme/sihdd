import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, FileText, Sparkles } from "lucide-react";

const STEPS = [
  { id: 'rascunho', label: 'Rascunho / Coleta', icon: FileText, color: 'blue' },
  { id: 'aguardando_pagamento', label: 'Aguardando Pagamento', icon: Clock, color: 'amber' },
  { id: 'concluido', label: 'Concluído', icon: Sparkles, color: 'green' },
];

const colorMap = {
  blue: { bg: 'bg-blue-600', bgLight: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-600' },
  amber: { bg: 'bg-amber-600', bgLight: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-600' },
  green: { bg: 'bg-green-600', bgLight: 'bg-green-100', text: 'text-green-600', border: 'border-green-600' },
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
          Linha do Tempo da Doação
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            const colors = colorMap[step.color];
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex gap-4 pb-8 last:pb-0 relative">
                {/* Linha vertical conectora */}
                {index < STEPS.length - 1 && (
                  <div 
                    className={`absolute left-6 top-14 w-0.5 h-full transition-all duration-500 ${
                      isCompleted ? colors.bg : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Ícone do Step */}
                <div className="relative z-10">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${isCompleted ? `${colors.bg} border-transparent shadow-lg scale-110` : ''}
                      ${isCurrent ? `${colors.bgLight} ${colors.border} shadow-xl animate-pulse scale-125` : ''}
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

                {/* Conteúdo do Step */}
                <div className="flex-1 pt-1">
                  <div className={`
                    p-4 rounded-xl border-2 transition-all duration-300
                    ${isCompleted ? `${colors.bgLight} ${colors.border} shadow-md` : ''}
                    ${isCurrent ? `${colors.bgLight} ${colors.border} shadow-xl` : ''}
                    ${isPending ? 'bg-white border-slate-200' : ''}
                  `}>
                    <h4 className={`
                      font-semibold mb-1 transition-colors duration-300
                      ${isCompleted ? colors.text : ''}
                      ${isCurrent ? colors.text : ''}
                      ${isPending ? 'text-slate-500' : ''}
                    `}>
                      {step.label}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {isCompleted && '✓ Concluído'}
                      {isCurrent && '⚡ Em andamento'}
                      {isPending && '⏳ Pendente'}
                    </p>
                    
                    {isCurrent && (
                      <div className="mt-2">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors.bg} rounded-full animate-pulse`}
                            style={{ width: '60%' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}