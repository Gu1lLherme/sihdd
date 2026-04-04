import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";

import StepHeader from "@/components/steps/StepHeader";
import StepNavigator from "@/components/steps/StepNavigator";
import StepContent from "@/components/steps/StepContent";
import StepActions from "@/components/steps/StepActions";

import DadosIniciais from "@/components/doacao/DadosIniciais";
import BensDoacao from "@/components/doacao/BensDoacao";
import ResumoDoacao from "@/components/doacao/ResumoDoacao";

const ETAPAS = [
  { id: 1, titulo: "Dados Iniciais", componente: DadosIniciais },
  { id: 2, titulo: "Bens", componente: BensDoacao },
  { id: 3, titulo: "Resumo", componente: ResumoDoacao },
];

export default function NovaDoacao() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const doacaoId = urlParams.get("id");
  const isEditing = !!doacaoId;

  const [etapaAtual, setEtapaAtual] = useState(1);
  const [formData, setFormData] = useState({
    doador_nome: "",
    doador_cpf: "",
    donatario_nome: "",
    donatario_cpf: "",
    bens: [],
    status: "rascunho"
  });

  useQuery({
    queryKey: ['doacao', doacaoId],
    queryFn: async () => {
      if (!doacaoId) return null;
      const doacao = (await base44.entities.Doacao.list()).find(d => d.id === doacaoId);
      const bensList = (await base44.entities.Bem.list()).filter(b => b.doacao_id === doacaoId);
      setFormData({ ...doacao, bens: bensList });
      return doacao;
    },
    enabled: !!doacaoId,
    retry: false
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const totalBens = (data.bens || []).reduce((acc, curr) => acc + (curr.valor || 0), 0);
      const tax = totalBens * 0.04;
      const doacaoData = {
        doador_nome: data.doador_nome,
        doador_cpf: data.doador_cpf,
        donatario_nome: data.donatario_nome,
        donatario_cpf: data.donatario_cpf,
        valor_total_bens: totalBens,
        valor_tributo: tax,
        data_doacao: data.data_doacao || new Date().toISOString().split('T')[0],
        status: data.status || "aguardando_pagamento"
      };
      if (isEditing) {
        await base44.entities.Doacao.update(doacaoId, doacaoData);
      } else {
        const doacao = await base44.entities.Doacao.create(doacaoData);
        if (data.bens.length > 0) {
          await base44.entities.Bem.bulkCreate(
            data.bens.map(b => ({ ...b, doacao_id: doacao.id, documento_url: "simulated_url.pdf" }))
          );
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doacoes'] });
      toast.success("Doação salva com sucesso!");
      navigate(createPageUrl("Doacoes"));
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao salvar doação.");
    }
  });

  const validateStep = (step) => {
    const missing = [];
    switch (step) {
      case 1:
        if (!formData.doador_nome || !formData.doador_nome.trim()) {
          toast.error("Nome do Doador (Interessado) é obrigatório para criar uma doação.");
          return false;
        }
        if (!formData.doador_cpf || !formData.doador_cpf.trim()) {
          toast.error("CPF do Doador (Interessado) é obrigatório para criar uma doação.");
          return false;
        }
        if (!formData.donatario_nome) missing.push("Nome do Donatário");
        if (!formData.donatario_cpf) missing.push("CPF do Donatário");
        if (missing.length > 0) {
          toast.error(`Preencha os dados obrigatórios: ${missing.join(", ")}`);
          return false;
        }
        return true;
      case 2:
        if (!formData.bens || formData.bens.length === 0) {
          toast.error("É necessário adicionar pelo menos um bem objeto da doação.");
          return false;
        }
        const invalidBem = formData.bens.find(b => !b.descricao || !b.valor || b.valor <= 0);
        if (invalidBem) {
          toast.error("Verifique os bens cadastrados: Descrição e Valor são obrigatórios.");
          return false;
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

  const EtapaComponente = ETAPAS[etapaAtual - 1].componente;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-4">
        <StepHeader
          titulo={isEditing ? "Editar Doação" : "Nova Doação"}
          subtitulo={isEditing ? "Atualize as informações" : "Preencha as etapas da doação"}
          backPath="FatoJuridico"
          backQuery="tab=doacoes"
        />
      </div>

      <StepNavigator
        etapas={ETAPAS}
        etapaAtual={etapaAtual}
        onNavigate={handleNavigate}
        canNavigateTo={(id) => id <= etapaAtual + 1}
        colorClass="blue-900"
        sticky
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8 pt-4">
        <StepContent titulo={ETAPAS[etapaAtual - 1].titulo}>
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
          saveLabel="Salvar Doação"
        />
      </div>
    </div>
  );
}