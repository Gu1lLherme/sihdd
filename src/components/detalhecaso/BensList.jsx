import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Car, CreditCard, Building2, CheckCircle2, AlertCircle } from "lucide-react";

const tipoIcons = {
  imovel: Home,
  veiculo: Car,
  conta_bancaria: CreditCard,
  investimento: Building2,
  empresa: Building2,
  outros: CreditCard,
};

const statusValidacao = {
  pendente: { label: "Pendente", color: "bg-amber-500", icon: AlertCircle },
  validado: { label: "Validado", color: "bg-green-500", icon: CheckCircle2 },
  revisar: { label: "A Revisar", color: "bg-red-500", icon: AlertCircle },
};

export default function BensList({ bens, isLoading }) {
  const totalValor = bens.reduce((sum, b) => sum + (parseFloat(b.valor) || 0), 0);

  return (
    <Card className="p-6 border-none shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-[#1e3a5f]" />
          <h3 className="text-lg font-semibold text-[#1e3a5f]">
            Bens ({bens.length})
          </h3>
        </div>
        <p className="text-sm font-semibold text-slate-600">
          Total: {totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : bens.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Nenhum bem cadastrado
        </div>
      ) : (
        <div className="space-y-4">
          {bens.map((bem) => {
            const IconComponent = tipoIcons[bem.tipo] || Home;
            const statusInfo = statusValidacao[bem.status_validacao] || statusValidacao.pendente;
            const StatusIcon = statusInfo.icon;

            return (
              <div key={bem.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-[#1e3a5f]">{bem.descricao}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {bem.tipo?.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${statusInfo.color} text-white border-none`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <p className="font-semibold text-[#1e3a5f]">
                        {parseFloat(bem.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    
                    {bem.identificacao && (
                      <p className="text-sm text-slate-600 mt-2">
                        {bem.identificacao}
                      </p>
                    )}
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