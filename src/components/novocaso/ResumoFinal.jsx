import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, User, Home, Users, Calculator } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ResumoFinal({ dadosCaso, herdeiros, bens }) {
  const totalPatrimonio = dadosCaso.valor_patrimonio || 0;
  const totalITCMD = dadosCaso.valor_itcmd || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          Revisão e Conclusão
        </h2>
        <p className="text-slate-600">
          Revise todas as informações antes de finalizar o caso
        </p>
      </div>

      <Card className="p-6 border-l-4 border-l-green-500 bg-green-50/50">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">
              ✓ Dados validados e consistentes
            </h3>
            <p className="text-sm text-green-700">
              Todas as informações foram verificadas e estão prontas para serem salvas
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#1e3a5f]" />
          <h3 className="text-lg font-semibold text-[#1e3a5f]">Dados do Falecido</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Nome</p>
            <p className="font-semibold">{dadosCaso.nome_falecido}</p>
          </div>
          {dadosCaso.cpf_falecido && (
            <div>
              <p className="text-sm text-slate-600">CPF</p>
              <p className="font-semibold">{dadosCaso.cpf_falecido}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-slate-600">Data do Óbito</p>
            <p className="font-semibold">
              {dadosCaso.data_obito && format(new Date(dadosCaso.data_obito), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
          {dadosCaso.conjuge_nome && (
            <div>
              <p className="text-sm text-slate-600">Cônjuge Sobrevivente</p>
              <p className="font-semibold">{dadosCaso.conjuge_nome}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[#1e3a5f]" />
          <h3 className="text-lg font-semibold text-[#1e3a5f]">Herdeiros ({herdeiros.length})</h3>
        </div>
        <div className="space-y-3">
          {herdeiros.map((herdeiro, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold">{herdeiro.nome}</p>
                <p className="text-sm text-slate-600 capitalize">{herdeiro.parentesco?.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#1e3a5f]">{herdeiro.percentual_partilha}%</p>
                <p className="text-sm text-amber-600 font-medium">
                  ITCMD: {herdeiro.valor_itcmd?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-[#1e3a5f]" />
          <h3 className="text-lg font-semibold text-[#1e3a5f]">Bens ({bens.length})</h3>
        </div>
        <div className="space-y-3">
          {bens.map((bem, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold">{bem.descricao}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {bem.tipo?.replace('_', ' ')}
                  </Badge>
                  {bem.identificacao && (
                    <span className="text-sm text-slate-600">{bem.identificacao}</span>
                  )}
                </div>
              </div>
              <p className="font-semibold text-[#1e3a5f]">
                {parseFloat(bem.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-[#1e3a5f]" />
          <h3 className="text-lg font-semibold text-[#1e3a5f]">Resumo Financeiro</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-600 mb-1">Patrimônio Total</p>
            <p className="text-2xl font-bold text-[#1e3a5f]">
              {totalPatrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Alíquota SEFAZ/SE</p>
            <p className="text-2xl font-bold text-blue-600">
              {dadosCaso.aliquota}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">ITCMD Total</p>
            <p className="text-2xl font-bold text-amber-600">
              {totalITCMD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">
              Próximos Passos
            </h3>
            <ul className="space-y-1 text-sm text-green-800">
              <li>✓ Geração automática das guias DAE</li>
              <li>✓ Envio de notificações aos herdeiros</li>
              <li>✓ Monitoramento do pagamento</li>
              <li>✓ Solicitação de certidão negativa SEFAZ/SE</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}