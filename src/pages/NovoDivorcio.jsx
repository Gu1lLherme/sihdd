import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, ChevronRight, ChevronLeft, FileCheck, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import { masks } from "@/components/Masks";

import DadosIniciaisDivorcio from "@/components/divorcio/DadosIniciaisDivorcio";
import FinanceiroDivorcio from "@/components/divorcio/FinanceiroDivorcio";
import ResumoDivorcio from "@/components/divorcio/ResumoDivorcio";

const ETAPAS = [
  { id: 1, titulo: "Dados Iniciais", componente: DadosIniciaisDivorcio },
  { id: 2, titulo: "Financeiro", componente: FinanceiroDivorcio },
  { id: 3, titulo: "Resumo", componente: ResumoDivorcio },
];

export default function NovoDivorcio() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const divorcioId = urlParams.get("id");
  const isEditing = !!divorcioId;

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [formData, setFormData] = useState({
    conjuge_doador_nome: "",
    conjuge_doador_cpf: "",
    conjuge_donatario_nome: "",
    conjuge_donatario_cpf: "",
    regime_bens: "",
    valor_excesso_meacao: "",
    valor_tributo: 0,
    status: "rascunho"
  });

  // Fetch for Edit
  useQuery({
    queryKey: ['divorcio', divorcioId],
    queryFn: async () => {
        if (!divorcioId) return null;
        const div = (await base44.entities.Divorcio.list()).find(d => d.id === divorcioId);
        // Ensure currency field is formatted as string for input if it comes as number
        const formattedData = {
            ...div,
            valor_excesso_meacao: div.valor_excesso_meacao ? masks.currency(div.valor_excesso_meacao * 100) : ""
        };
        setFormData(formattedData);
        return div;
    },
    enabled: !!divorcioId,
    retry: false
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const cleanData = {
        ...data,
        valor_excesso_meacao: masks.currencyToNumber(data.valor_excesso_meacao),
        status: data.status || "aguardando_pagamento"
      };

      if (isEditing) {
        return await base44.entities.Divorcio.update(divorcioId, cleanData);
      } else {
        return await base44.entities.Divorcio.create(cleanData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divorcios'] });
      toast.success("Divórcio salvo com sucesso!");
      navigate(createPageUrl("Divorcios"));
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao salvar divórcio.");
    }
  });

  const validateStep = (step) => {
    const missing = [];

    switch(step) {
      case 1: // Dados Iniciais
        if (!formData.conjuge_doador_nome) missing.push("Nome do Cônjuge Doador");
        if (!formData.conjuge_doador_cpf) missing.push("CPF do Cônjuge Doador");
        if (!formData.conjuge_donatario_nome) missing.push("Nome do Cônjuge Donatário");
        if (!formData.conjuge_donatario_cpf) missing.push("CPF do Cônjuge Donatário");
        if (!formData.regime_bens) missing.push("Regime de Bens");

        if (missing.length > 0) {
          toast.error(`Por favor, preencha: ${missing.join(", ")}`);
          return false;
        }
        return true;

      case 2: // Financeiro
        if (!formData.valor_excesso_meacao && formData.valor_excesso_meacao !== 0) {
             toast.warning("Verifique se há Excesso de Meação a declarar.");
        }
        return true;
        
      default:
        return true;
    }
  };

  const avancar = () => {
    if (validateStep(etapaAtual)) {
      if (etapaAtual < ETAPAS.length) {
        setEtapaAtual(etapaAtual + 1);
      }
    }
  };

  const voltar = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const salvar = () => {
    mutation.mutate(formData);
  };

  const handleGenerateGuia = () => {
    alert("Integração SEFAZ-SE: Guia de Excesso de Meação gerada!");
  };

  const EtapaComponente = ETAPAS[etapaAtual - 1].componente;

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Divorcios"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">{isEditing ? "Editar Divórcio" : "Novo Divórcio"}</h1>
            <p className="text-slate-600 mt-1">{isEditing ? "Atualize as informações" : "Preencha as etapas do divórcio"}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {ETAPAS.map((etapa, index) => (
              <div key={etapa.id} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => {
                    if (etapa.id <= etapaAtual) setEtapaAtual(etapa.id);
                    else if (validateStep(etapaAtual)) setEtapaAtual(etapa.id);
                  }}
                  disabled={etapa.id > etapaAtual + 1}
                  className={`flex flex-col items-center flex-1 ${etapa.id > etapaAtual + 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      etapaAtual >= etapa.id
                        ? "bg-purple-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {etapa.id}
                  </div>
                  <p
                    className={`text-sm mt-2 font-medium ${
                      etapaAtual >= etapa.id ? "text-purple-600" : "text-slate-500"
                    }`}
                  >
                    {etapa.titulo}
                  </p>
                </button>
                {index < ETAPAS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-colors ${
                      etapaAtual > etapa.id ? "bg-purple-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-slate-200 shadow-lg mb-6">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-xl text-purple-600">
              {ETAPAS[etapaAtual - 1].titulo}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <EtapaComponente formData={formData} setFormData={setFormData} />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={voltar}
              disabled={etapaAtual === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="text-slate-600 hover:text-slate-800"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="flex gap-2">
            {etapaAtual === ETAPAS.length && (
                <Button variant="outline" className="border-purple-600 text-purple-600" onClick={handleGenerateGuia}>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Gerar Guia
                </Button>
            )}

            {isEditing && etapaAtual < ETAPAS.length && (
              <Button
                onClick={() => { salvar(); setEtapaAtual(ETAPAS.length); }}
                disabled={mutation.isPending}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {mutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            )}

            {etapaAtual < ETAPAS.length ? (
                <Button
                onClick={avancar}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            ) : (
                <Button
                onClick={salvar}
                disabled={mutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
                >
                <Save className="w-4 h-4 mr-2" />
                {mutation.isPending ? "Salvando..." : "Salvar Divórcio"}
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}