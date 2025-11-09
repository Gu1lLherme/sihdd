import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";

export default function HerdeirosList({ herdeiros, isLoading }) {
  return (
    <Card className="p-6 border-none shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-[#1e3a5f]" />
        <h3 className="text-lg font-semibold text-[#1e3a5f]">
          Herdeiros ({herdeiros.length})
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : herdeiros.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Nenhum herdeiro cadastrado
        </div>
      ) : (
        <div className="space-y-4">
          {herdeiros.map((herdeiro) => (
            <div key={herdeiro.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-[#1e3a5f]">{herdeiro.nome}</h4>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {herdeiro.parentesco?.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1e3a5f]">
                    {herdeiro.percentual_partilha}%
                  </p>
                  <p className="text-sm text-slate-600">
                    {herdeiro.valor_parte?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-200 mt-2">
                <p className="text-sm text-amber-700 font-medium">
                  ITCMD: {herdeiro.valor_itcmd?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>

              {(herdeiro.email || herdeiro.telefone) && (
                <div className="mt-3 space-y-1">
                  {herdeiro.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{herdeiro.email}</span>
                    </div>
                  )}
                  {herdeiro.telefone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{herdeiro.telefone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}