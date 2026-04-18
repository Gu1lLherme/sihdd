import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ShieldOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StepHeader from "@/components/steps/StepHeader";
import StepNavigator from "@/components/steps/StepNavigator";
import StepContent from "@/components/steps/StepContent";
import StepActions from "@/components/steps/StepActions";

import DadosBasicos from "../components/novocaso/DadosBasicos";
import DadosConjuge from "../components/novocaso/DadosConjuge";
import DadosInventario from "../components/novocaso/DadosInventario";
import AdministradorProvisorio from "../components/novocaso/AdministradorProvisorio";
import Herdeiros from "../components/novocaso/Herdeiros";
import Bens from "../components/novocaso/Bens";
import Dividas from "../components/novocaso/Dividas";
import Resumo from "../components/novocaso/Resumo";
import FormInventariante from "@/components/inventarios/FormInventariante";

import { useValidacaoEtapa } from "@/hooks/useValidacaoEtapa";
import { useCalcularPartilha } from "@/hooks/useCalcularPartilha";
import { gerarNumeroCasoUnico } from "@/hooks/useNumeroCasoUnico";

const ETAPAS = [
  { id: 1, titulo: "Dados Falecido", componente: DadosBasicos },
  { id: 2, titulo: "Dados Cônjuge", componente: DadosConjuge },
  { id: 3, titulo: "Tipo Inventário", componente: DadosInventario },
  { id: 4, titulo: "Adm. Provisório", componente: AdministradorProvisorio },
  { id: 5, titulo: "Herdeiros", componente: Herdeiros },
  { id: 6, titulo: "Inventariante", componente: FormInventariante },
  { id: 7, titulo: "Bens", componente: Bens },
  { id: 8, titulo: "Dívidas", componente: Dividas },
  { id: 9, titulo: "Resumo", componente: Resumo },
];

const INITIAL_FORM = {
  nome_falecido: "", cpf_falecido: "", data_obito: "",
  conjuge_nome: "", conjuge_cpf: "", data_casamento: "",
  conjuge_e_ascendente_herdeiros: true, regime_bens: "comunhao_parcial",
  valor_patrimonio: 0, valor_meacao_conjuge: 0, valor_heranca_conjuge: 0, valor_heranca_filhos: 0,
  aliquota: 4, status: "coleta_dados",
  herdeiros: [], bens: [], dividas: [],
  inventariante: { nome: "", cpf_cnpj: "", email: "", data_nomeacao: "", vinculo: "herdeiro", status: "ativo" },
  administrador_provisorio: { nome: "", cpf: "", endereco: "", cep: "", email: "", telefone: "", conjuge_nome: "", conjuge_cpf: "" },
};

export default function NovoCaso() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const casoId = urlParams.get("id");
  const isEditing = !!casoId;

  const [etapaAtual, setEtapaAtual] = useState(isEditing ? 9 : 1);
  const [resultadoPartilha, setResultadoPartilha] = useState(null);
  const [skipValidation, setSkipValidation] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { validateStep, canNavigateToStep } = useValidacaoEtapa(formData, skipValidation);
  const { calcular, isCalculating } = useCalcularPartilha({ casoId, formData, setFormData, setResultadoPartilha });

  useEffect(() => {
    const handler = (e) => {
      setEtapaAtual(e.detail.etapa);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    };
    window.addEventListener("resumo-navigate", handler);
    return () => window.removeEventListener("resumo-navigate", handler);
  }, []);

  const { data: user } = useQuery({ queryKey: ["user"], queryFn: () => base44.auth.me(), retry: false });

  useQuery({
    queryKey: ["caso", casoId],
    queryFn: async () => {
      if (!casoId) return null;
      const caso = (await base44.entities.Caso.list()).find((c) => c.id === casoId);
      const [herdeiros, bens, dividas, inventariantes] = await Promise.all([
        base44.entities.Herdeiro.filter({ caso_id: casoId }),
        base44.entities.Bem.filter({ caso_id: casoId }),
        base44.entities.Divida.filter({ caso_id: casoId }),
        base44.entities.Inventariante.filter({ caso_id: casoId }),
      ]);
      setFormData({ ...caso, herdeiros, bens, dividas, inventariante: inventariantes[0] || INITIAL_FORM.inventariante });
      return caso;
    },
    enabled: !!casoId, retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const numero_caso = await gerarNumeroCasoUnico("PROC");
      const caso = await base44.entities.Caso.create({ ...data, numero_caso, status: "geracao_dae", prazo_dias: 30 });

      if (data.herdeiros.length > 0)
        await base44.entities.Herdeiro.bulkCreate(data.herdeiros.map((h) => ({ ...h, caso_id: caso.id })));
      if (data.bens.length > 0)
        await base44.entities.Bem.bulkCreate(data.bens.map((b) => ({ ...b, caso_id: caso.id })));
      if (data.dividas?.length > 0)
        await base44.entities.Divida.bulkCreate(data.dividas.map((d) => ({ ...d, caso_id: caso.id })));

      if (data.inventariante?.nome) {
        await base44.entities.Inventariante.create({ ...data.inventariante, caso_id: caso.id });
        const baseDate = data.inventariante.data_nomeacao ? new Date(data.inventariante.data_nomeacao + "T00:00:00") : new Date();
        const safeBase = isNaN(baseDate.getTime()) ? new Date() : baseDate;
        const due5 = new Date(safeBase); due5.setDate(due5.getDate() + 5);
        const due10 = new Date(safeBase); due10.setDate(due10.getDate() + 10);
        const due12m = new Date(safeBase); due12m.setMonth(due12m.getMonth() + 12);

        await base44.entities.Task.bulkCreate([
          { caso_id: caso.id, titulo: "Requisitar Documentos Iniciais ao Inventariante", descricao: "Solicitar documentos pessoais e do espólio.", tipo: "documento", status: "pendente", data_vencimento: due5.toISOString().split("T")[0], prioridade: "alta" },
          { caso_id: caso.id, titulo: "Revisão de Prazos Fiscais Estaduais (ITCMD/ITCD)", descricao: "Verificar prazos para declaração e pagamento de impostos.", tipo: "prazo", status: "pendente", data_vencimento: due10.toISOString().split("T")[0], prioridade: "alta" },
        ]);
        await base44.entities.CalendarEvent.create({
          caso_id: caso.id, titulo: "Prazo Finalização Inventário (12 meses)", tipo: "prazo_itcmd",
          data_inicio: due12m.toISOString(), data_fim: due12m.toISOString(),
          descricao: "Prazo estimado para finalização do processo de inventário.", cor: "red",
        });
      }

      await base44.entities.AuditLog.create({
        caso_id: caso.id, action_type: "create", entity_type: "Caso", entity_id: caso.id,
        action_description: `Novo caso criado: Inventário de ${data.nome_falecido}`,
        user_email: user?.email || "unknown", user_name: user?.full_name || "Unknown",
        new_data: { falecido: data.nome_falecido, patrimonio: data.valor_patrimonio, herdeiros_count: data.herdeiros.length, bens_count: data.bens.length },
      });
      return caso;
    },
    onSuccess: (caso) => {
      queryClient.invalidateQueries({ queryKey: ["casos"] });
      toast.success("Caso salvo com sucesso!");
      navigate(createPageUrl(`DetalheCaso?id=${caso.id}`));
    },
    onError: (error) => {
      console.error("Erro ao salvar caso:", error);
      toast.error("Erro ao salvar o caso. Verifique os dados e tente novamente.");
    },
  });

  const scrollToTop = () => {
    setTimeout(() => {
      const el = document.getElementById("etapa-content");
      (el ? el.scrollIntoView({ behavior: "smooth", block: "start" }) : window.scrollTo({ top: 0, behavior: "smooth" }));
    }, 100);
  };

  const avancar = async () => {
    if (!validateStep(etapaAtual)) return;
    if (etapaAtual < ETAPAS.length) {
      const proxima = etapaAtual + 1;
      setEtapaAtual(proxima);
      scrollToTop();
      if (proxima === 9) await calcular();
    }
  };

  const voltar = () => {
    if (etapaAtual > 1) { setEtapaAtual(etapaAtual - 1); scrollToTop(); }
  };

  const navegarParaEtapa = (etapaId) => {
    if (etapaId > etapaAtual && !canNavigateToStep(etapaId)) {
      toast.error("Preencha os campos obrigatórios das etapas anteriores para avançar.");
      return;
    }
    setEtapaAtual(etapaId);
    scrollToTop();
  };

  const EtapaComponente = ETAPAS[etapaAtual - 1].componente;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-4">
        <StepHeader
          titulo={isEditing ? "Editar Inventário" : "Novo Caso de Inventário"}
          subtitulo={isEditing ? "Atualize as informações do processo" : "Preencha as informações do processo"}
          backPath="FatoJuridico" backQuery="tab=inventarios"
          rightContent={
            <Button
              variant={skipValidation ? "destructive" : "outline"} size="sm"
              onClick={() => {
                setSkipValidation(!skipValidation);
                toast.info(skipValidation ? "Validação reativada" : "Validação desativada (modo teste)");
              }}
              className="gap-2 text-xs"
            >
              {skipValidation ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              {skipValidation ? "Validação OFF" : "Validação ON"}
            </Button>
          }
        />
      </div>

      <StepNavigator etapas={ETAPAS} etapaAtual={etapaAtual} onNavigate={navegarParaEtapa} canNavigateTo={canNavigateToStep} colorClass="blue-900" sticky />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8 pt-4">
        <StepContent id="etapa-content" titulo={ETAPAS[etapaAtual - 1].titulo}>
          <EtapaComponente formData={formData} setFormData={setFormData} isCalculating={isCalculating} resultadoPartilha={resultadoPartilha} />
        </StepContent>

        <StepActions
          etapaAtual={etapaAtual} totalEtapas={ETAPAS.length}
          onAvancar={avancar} onVoltar={voltar} onSalvar={() => mutation.mutate(formData)}
          isSaving={mutation.isPending} isSaved={mutation.isSuccess} isEditing={isEditing}
          saveLabel="Salvar Caso"
        />
      </div>
    </div>
  );
}