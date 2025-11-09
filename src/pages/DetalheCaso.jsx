import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CasoHeader from "../components/detalhecaso/CasoHeader";
import StatusTimeline from "../components/detalhecaso/StatusTimeline";
import HerdeirosList from "../components/detalhecaso/HerdeirosList";
import BensList from "../components/detalhecaso/BensList";
import GuiasDAE from "../components/detalhecaso/GuiasDAE";

export default function DetalheCaso() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const casoId = urlParams.get('id');

  const { data: caso, isLoading: loadingCaso } = useQuery({
    queryKey: ['caso', casoId],
    queryFn: async () => {
      const casos = await base44.entities.Caso.list();
      return casos.find(c => c.id === casoId);
    },
    enabled: !!casoId,
  });

  const { data: herdeiros, isLoading: loadingHerdeiros } = useQuery({
    queryKey: ['herdeiros', casoId],
    queryFn: async () => {
      const allHerdeiros = await base44.entities.Herdeiro.list();
      return allHerdeiros.filter(h => h.caso_id === casoId);
    },
    initialData: [],
    enabled: !!casoId,
  });

  const { data: bens, isLoading: loadingBens } = useQuery({
    queryKey: ['bens', casoId],
    queryFn: async () => {
      const allBens = await base44.entities.Bem.list();
      return allBens.filter(b => b.caso_id === casoId);
    },
    initialData: [],
    enabled: !!casoId,
  });

  const { data: guias, isLoading: loadingGuias } = useQuery({
    queryKey: ['guias', casoId],
    queryFn: async () => {
      const allGuias = await base44.entities.GuiaDAE.list();
      return allGuias.filter(g => g.caso_id === casoId);
    },
    initialData: [],
    enabled: !!casoId,
  });

  if (loadingCaso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando caso...</p>
        </div>
      </div>
    );
  }

  if (!caso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Caso não encontrado</h2>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
            Voltar ao Dashboard
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
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a5f]">
              Inventário — {caso.nome_falecido}
            </h1>
            <p className="text-slate-600">Acompanhamento detalhado do processo</p>
          </div>
        </div>

        <div className="space-y-6">
          <CasoHeader caso={caso} />
          
          <StatusTimeline status={caso.status} />
          
          <div className="grid lg:grid-cols-2 gap-6">
            <HerdeirosList herdeiros={herdeiros} isLoading={loadingHerdeiros} />
            <BensList bens={bens} isLoading={loadingBens} />
          </div>
          
          <GuiasDAE guias={guias} herdeiros={herdeiros} isLoading={loadingGuias} />
        </div>
      </div>
    </div>
  );
}