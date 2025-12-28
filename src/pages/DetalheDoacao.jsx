import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import DoacaoHeader from "../components/detalhedoacao/DoacaoHeader";
import DoacaoTimeline from "../components/detalhedoacao/DoacaoTimeline";
import BensList from "../components/detalhecaso/BensList"; // Reusing BensList

export default function DetalheDoacao() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const doacaoId = urlParams.get('id');

  const { data: doacao, isLoading: loadingDoacao } = useQuery({
    queryKey: ['doacao', doacaoId],
    queryFn: async () => {
      const doacoes = await base44.entities.Doacao.list();
      return doacoes.find(c => c.id === doacaoId);
    },
    enabled: !!doacaoId,
  });

  const { data: bens, isLoading: loadingBens } = useQuery({
    queryKey: ['bens_doacao', doacaoId],
    queryFn: async () => {
      const allBens = await base44.entities.Bem.list();
      return allBens.filter(b => b.doacao_id === doacaoId);
    },
    initialData: [],
    enabled: !!doacaoId,
  });

  if (loadingDoacao) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando doação...</p>
        </div>
      </div>
    );
  }

  if (!doacao) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Doação não encontrada</h2>
          <Button onClick={() => navigate(createPageUrl("Doacoes"))}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Doacoes"))}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              Detalhes da Doação
            </h1>
            <p className="text-slate-600">Acompanhamento do processo</p>
          </div>
        </div>

        <div className="space-y-6">
          <DoacaoHeader doacao={doacao} />
          
          <DoacaoTimeline status={doacao.status} />
          
          <div className="grid lg:grid-cols-1 gap-6">
            <BensList bens={bens} isLoading={loadingBens} />
          </div>

          {/* If there was a Payment/Guia section, it would go here */}
        </div>
      </div>
    </div>
  );
}