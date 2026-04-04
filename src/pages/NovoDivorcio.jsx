import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import { masks } from "@/components/Masks";

import StepHeader from "@/components/steps/StepHeader";
import StepNavigator from "@/components/steps/StepNavigator";
import StepContent from "@/components/steps/StepContent";
import StepActions from "@/components/steps/StepActions";

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

  useQuery({
    queryKey: ['divorcio', divorcioId],
    queryFn: async () => {
      if (!divorcioId) return null;
      const div = (await base44.entities.Divorcio.list()).find(d => d.id === divorcioId);
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
    switch (step) {
      case 1:
        if (!formData.conjuge_doador_nome || !formData.conjuge_doador_nome.trim()) {
          toast.error("Nome do Cônjuge Doador (Interessado) é obrigatório para criar um divórcio.");
          return false;
        }
        if (!formData.conjuge_doador_cpf || !formData.conjuge_doador_cpf.trim()) {
          toast.error("CPF do Cônjuge Doador (Interessado) é obrigatório para criar um divórcio.");
          return false;
        }
        if (!formData.conjuge_donatario_nome) missing.push("Nome do Cônjuge Donatário");
        if (!formData.conjuge_donatario_cpf) missing.push("CPF do Cônjuge Donatário");
        if (!formData.regime_bens) missing.push("Regime de Bens");
        if (missing.length > 0) {
          toast.error(`Por favor, preencha: ${missing.join(", ")}`);
          return false;
        }
        return true;
      case 2:
        if (!formData.valor_excesso_meacao && formData.valor_excesso_meacao !== 0) {
          toast.warning("Verifique se há Excesso de Meação a declarar.");
        }
        return true;
      default:
        return true;
    }
  };

  const scrollToTop = () => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const avancar = () => {
    if (validateStep(etapaAtual) && etapaAtual < ETAPAS.length) {
      setEtapaAtual(etapaAtual + 1);
      scrollToTop();
    }
  };

  const voltar = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
      scrollToTop();
    }
  };

  const handleNavigate = (etapaId) => {
    if (etapaId <= etapaAtual) {
      setEtapaAtual(etapaId);
      scrollToTop();
    } else if (validateStep(etapaAtual)) {
      setEtapaAtual(etapaId);
      scrollToTop();
    }
  };

  const salvar = () => mutation.mutate(formData);

  const handleGenerateGuia = () => {
    alert("Integração SEFAZ-SE: Guia de Excesso de Meação gerada!");
  };

  const EtapaComponente = ETAPAS[etapaAtual - 1].componente;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-4">
        <StepHeader
          titulo={isEditing ? "Editar Divórcio" : "Novo Divórcio"}
          subtitulo={isEditing ? "Atualize as informações" : "Preencha as etapas do divórcio"}
          backPath="FatoJuridico"
          backQuery="tab=divorcios"
          colorClass="text-[#333333]"
        />
      </div>

      <StepNavigator
        etapas={ETAPAS}
        etapaAtual={etapaAtual}
        onNavigate={handleNavigate}
        canNavigateTo={(id) => id <= etapaAtual + 1}
        colorClass="purple-600"
        sticky
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8 pt-4">
        <StepContent titulo={ETAPAS[etapaAtual - 1].titulo} colorClass="text-purple-600">
          <EtapaComponente formData={formData} setFormData={setFormData} />
        </StepContent>

        <StepActions
          etapaAtual={etapaAtual}
          totalEtapas={ETAPAS.length}
          onAvancar={avancar}
          onVoltar={voltar}
          onSalvar={salvar}
          isSaving={mutation.isPending}
          isEditing={isEditing}
          saveLabel="Salvar Divórcio"
          nextColorClass="bg-purple-600 hover:bg-purple-700"
          extraActions={
            <Button variant="outline" className="border-purple-600 text-purple-600" onClick={handleGenerateGuia}>
              <FileCheck className="w-4 h-4 mr-2" />
              Gerar Guia
            </Button>
          }
        />
      </div>
    </div>
  );
}