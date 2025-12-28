import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import DivorcioHeader from "../components/detalhedivorcio/DivorcioHeader";
import DivorcioTimeline from "../components/detalhedivorcio/DivorcioTimeline";

export default function DetalheDivorcio() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const divorcioId = urlParams.get('id');

  const { data: divorcio, isLoading: loadingDivorcio } = useQuery({
    queryKey: ['divorcio', divorcioId],
    queryFn: async () => {
      const divorcios = await base44.entities.Divorcio.list();
      return divorcios.find(c => c.id === divorcioId);
    },
    enabled: !!divorcioId,
  });

  if (loadingDivorcio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando divórcio...</p>
        </div>
      </div>
    );
  }

  if (!divorcio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Divórcio não encontrado</h2>
          <Button onClick={() => navigate(createPageUrl("Divorcios"))}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Divorcios"))}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-purple-900">
              Detalhes do Divórcio
            </h1>
            <p className="text-slate-600">Acompanhamento do processo</p>
          </div>
        </div>

        <div className="space-y-6">
          <DivorcioHeader divorcio={divorcio} />
          
          <DivorcioTimeline status={divorcio.status} />

           {/* Add any specific sections for Divorce here, e.g. Payment/Guia if applicable */}
        </div>
      </div>
    </div>
  );
}