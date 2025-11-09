import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import DadosBasicos from "../components/novocaso/DadosBasicos";
import Herdeiros from "../components/novocaso/Herdeiros";
import Bens from "../components/novocaso/Bens";
import Resumo from "../components/novocaso/Resumo";

const ETAPAS = [
  { id: 1, titulo: "Dados Básicos", componente: DadosBasicos },
  { id: 2, titulo: "Herdeiros", componente: Herdeiros },
  { id: 3, titulo: "Bens", componente: Bens },
  { id: 4, titulo: "Resumo", componente: Resumo },
];

export default function NovoCaso() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [formData, setFormData] = useState({
    falecido_nome: "",
    falecido_cpf: "",
    data_obito: "",
    conjuge_nome: "",
    conjuge_cpf: "",
    patrimonio_total: 0,
    aliquota: 4,
    status: "rascunho",
    herdeiros: [],
    bens: [],
  });

  const criarCasoMutation = useMutation({
    mutationFn: async (data) => {
      const caso = await base44.entities.Caso.create({
        numero_processo: `PROC-${Date.now()}`,
        falecido_nome: data.falecido_nome,
        falecido_cpf: data.falecido_cpf,
        data_obito: data.data_obito,
        conjuge_nome: data.conjuge_nome,
        conjuge_cpf: data.conjuge_cpf,
        patrimonio_total: data.patrimonio_total,
        itcmd_total: data.patrimonio_total * (data.aliquota / 100),
        aliquota: data.aliquota,
        status: "em_analise",
      });

      if (data.herdeiros.length > 0) {
        await base44.entities.Herdeiro.bulkCreate(
          data.herdeiros.map(h => ({ ...h, caso_id: caso.id }))
        );
      }

      if (data.bens.length > 0) {
        await base44.entities.Bem.bulkCreate(
          data.bens.map(b => ({ ...b, caso_id: caso.id }))
        );
      }

      return caso;
    },
    onSuccess: (caso) => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      navigate(createPageUrl(`DetalhesCaso?id=${caso.id}`));
    },
  });

  const avancar = () => {
    if (etapaAtual < ETAPAS.length) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const voltar = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const salvar = () => {
    criarCasoMutation.mutate(formData);
  };

  const EtapaComponente = ETAPAS[etapaAtual - 1].componente;

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Novo Caso de Inventário</h1>
            <p className="text-slate-600 mt-1">Preencha as informações do processo</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {ETAPAS.map((etapa, index) => (
              <div key={etapa.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      etapaAtual >= etapa.id
                        ? "bg-blue-900 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {etapa.id}
                  </div>
                  <p
                    className={`text-sm mt-2 font-medium ${
                      etapaAtual >= etapa.id ? "text-blue-900" : "text-slate-500"
                    }`}
                  >
                    {etapa.titulo}
                  </p>
                </div>
                {index < ETAPAS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-colors ${
                      etapaAtual > etapa.id ? "bg-blue-900" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Etapa Content */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-xl text-blue-900">
              {ETAPAS[etapaAtual - 1].titulo}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <EtapaComponente formData={formData} setFormData={setFormData} />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={voltar}
            disabled={etapaAtual === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {etapaAtual < ETAPAS.length ? (
            <Button
              onClick={avancar}
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={salvar}
              disabled={criarCasoMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {criarCasoMutation.isPending ? "Salvando..." : "Salvar Caso"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}