import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
// Card é utilizado via StepContent
import { Save, ShieldOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StepHeader from "@/components/steps/StepHeader";
import StepNavigator from "@/components/steps/StepNavigator";
import StepContent from "@/components/steps/StepContent";
import StepActions from "@/components/steps/StepActions";

import { validators } from "@/components/validations";
import { scrollToError } from "@/components/novocaso/scrollToError";
import DadosBasicos from "../components/novocaso/DadosBasicos";
import DadosConjuge from "../components/novocaso/DadosConjuge";
import DadosInventario from "../components/novocaso/DadosInventario";
import AdministradorProvisorio from "../components/novocaso/AdministradorProvisorio";
import Herdeiros from "../components/novocaso/Herdeiros";
import Bens from "../components/novocaso/Bens";
import Dividas from "../components/novocaso/Dividas";
import Resumo from "../components/novocaso/Resumo";
import FormInventariante from "@/components/inventarios/FormInventariante";



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

export default function NovoCaso() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const casoId = urlParams.get("id");
  const isEditing = !!casoId;

  const [etapaAtual, setEtapaAtual] = useState(isEditing ? 9 : 1);
  const [resultadoPartilha, setResultadoPartilha] = useState(null);
  const [skipValidation, setSkipValidation] = useState(false);

  // Listener para navegação a partir do Resumo (botão "Editar")
  React.useEffect(() => {
    const handler = (e) => {
      setEtapaAtual(e.detail.etapa);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    };
    window.addEventListener('resumo-navigate', handler);
    return () => window.removeEventListener('resumo-navigate', handler);
  }, []);
  const [formData, setFormData] = useState({
    nome_falecido: "",
    cpf_falecido: "",
    data_obito: "",
    conjuge_nome: "",
    conjuge_cpf: "",
    data_casamento: "",
    conjuge_e_ascendente_herdeiros: true,
    regime_bens: "comunhao_parcial",
    valor_patrimonio: 0,
    valor_meacao_conjuge: 0,
    valor_heranca_conjuge: 0,
    valor_heranca_filhos: 0,
    aliquota: 4,
    status: "coleta_dados",
    herdeiros: [],
    bens: [],
    dividas: [],
    inventariante: {
        nome: "",
        cpf_cnpj: "",
        email: "",
        data_nomeacao: "",
        vinculo: "herdeiro",
        status: "ativo"
    },
    administrador_provisorio: {
        nome: "",
        cpf: "",
        endereco: "",
        cep: "",
        email: "",
        telefone: "",
        conjuge_nome: "",
        conjuge_cpf: ""
    }
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  // Fetch data for editing
  useQuery({
    queryKey: ['caso', casoId],
    queryFn: async () => {
        if (!casoId) return null;
        const caso = (await base44.entities.Caso.list()).find(c => c.id === casoId);
        // Note: Herdeiros and Bens need to be fetched separately ideally, or assuming we have them
        // For simplicity in this structure, we'd need to fetch related entities too to populate formData fully
        const herdeiros = (await base44.entities.Herdeiro.list()).filter(h => h.caso_id === casoId);
        const bens = (await base44.entities.Bem.list()).filter(b => b.caso_id === casoId);
        const dividas = (await base44.entities.Divida.list()).filter(d => d.caso_id === casoId);
        const inventariante = (await base44.entities.Inventariante.list()).find(i => i.caso_id === casoId);

        setFormData({
            ...caso,
            herdeiros,
            bens,
            dividas,
            inventariante: inventariante || formData.inventariante
        });
        return caso;
    },
    enabled: !!casoId,
    retry: false
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const caso = await base44.entities.Caso.create({
        numero_caso: `PROC-${Date.now()}`,
        nome_falecido: data.nome_falecido,
        cpf_falecido: data.cpf_falecido,
        rg: data.rg,
        orgao_expedidor: data.orgao_expedidor,
        data_expedicao: data.data_expedicao,
        sexo: data.sexo,
        nacionalidade: data.nacionalidade,
        data_nascimento: data.data_nascimento,
        data_obito: data.data_obito,
        horario_obito: data.horario_obito,
        local_obito: data.local_obito,
        endereco: data.endereco,
        cep: data.cep,
        estado_civil: data.estado_civil,
        tipo_inventario: data.tipo_inventario || 'extrajudicial',
        tipo_processo: data.tipo_processo || 'inventario',
        data_abertura_inventario: data.data_abertura_inventario,
        data_distribuicao: data.data_distribuicao,
        numero_processo_judicial: data.numero_processo_judicial,
        vara_comarca: data.vara_comarca,
        data_homologacao_partilha: data.data_homologacao_partilha,
        data_transito_julgado: data.data_transito_julgado,
        numero_sobrepartilha: data.numero_sobrepartilha,
        vara_comarca_sobrepartilha: data.vara_comarca_sobrepartilha,
        data_homologacao_sobrepartilha: data.data_homologacao_sobrepartilha,
        data_transito_julgado_sobrepartilha: data.data_transito_julgado_sobrepartilha,
        cartorio_nome: data.cartorio_nome,
        cartorio_municipio: data.cartorio_municipio,
        cartorio_comarca: data.cartorio_comarca,
        cessao_direitos: data.cessao_direitos,
        renuncia_abdicativa: data.renuncia_abdicativa,
        conjuge_nome: data.conjuge_nome,
        conjuge_cpf: data.conjuge_cpf,
        conjuge_endereco: data.conjuge_endereco,
        conjuge_cep: data.conjuge_cep,
        conjuge_telefone: data.conjuge_telefone,
        conjuge_email: data.conjuge_email,
        data_atendimento: data.data_atendimento,
        data_casamento: data.data_casamento,
        conjuge_e_ascendente_herdeiros: data.conjuge_e_ascendente_herdeiros,
        regime_bens: data.regime_bens,
        valor_patrimonio: data.valor_patrimonio,
        valor_meacao_conjuge: data.valor_meacao_conjuge,
        valor_heranca_conjuge: data.valor_heranca_conjuge,
        valor_heranca_filhos: data.valor_heranca_filhos,
        valor_itcmd: data.valor_itcmd,
        aliquota: data.aliquota,
        status: "geracao_dae",
        prazo_dias: 30,
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

      if (data.dividas && data.dividas.length > 0) {
        await base44.entities.Divida.bulkCreate(
          data.dividas.map(d => ({ ...d, caso_id: caso.id }))
        );
      }

      // Criar Inventariante
      if (data.inventariante && data.inventariante.nome) {
          await base44.entities.Inventariante.create({
              ...data.inventariante,
              caso_id: caso.id
          });

          // Automação: Criar Tarefas
          const baseDate = data.inventariante.data_nomeacao ? new Date(data.inventariante.data_nomeacao + 'T00:00:00') : new Date();
          // Se a data for inválida, usar data atual
          const safeBase = isNaN(baseDate.getTime()) ? new Date() : baseDate;
          const due5Days = new Date(safeBase); due5Days.setDate(due5Days.getDate() + 5);
          const due10Days = new Date(safeBase); due10Days.setDate(due10Days.getDate() + 10);
          const due12Months = new Date(safeBase); due12Months.setMonth(due12Months.getMonth() + 12);

          await base44.entities.Task.bulkCreate([
              {
                  caso_id: caso.id,
                  titulo: "Requisitar Documentos Iniciais ao Inventariante",
                  descricao: "Solicitar documentos pessoais e do espólio.",
                  tipo: "documento",
                  status: "pendente",
                  data_vencimento: due5Days.toISOString().split('T')[0],
                  prioridade: "alta"
              },
              {
                  caso_id: caso.id,
                  titulo: "Revisão de Prazos Fiscais Estaduais (ITCMD/ITCD)",
                  descricao: "Verificar prazos para declaração e pagamento de impostos.",
                  tipo: "prazo",
                  status: "pendente",
                  data_vencimento: due10Days.toISOString().split('T')[0],
                  prioridade: "alta"
              }
          ]);

          // Automação: Criar Evento Calendário
          await base44.entities.CalendarEvent.create({
              caso_id: caso.id,
              titulo: "Prazo Finalização Inventário (12 meses)",
              tipo: "prazo_itcmd",
              data_inicio: due12Months.toISOString(),
              data_fim: due12Months.toISOString(),
              descricao: "Prazo estimado para finalização do processo de inventário.",
              cor: "red"
          });
      }

      // Registrar na auditoria
      await base44.entities.AuditLog.create({
        caso_id: caso.id,
        action_type: "create",
        entity_type: "Caso",
        entity_id: caso.id,
        action_description: `Novo caso criado: Inventário de ${data.nome_falecido}`,
        user_email: user?.email || "unknown",
        user_name: user?.full_name || "Unknown",
        new_data: {
          falecido: data.nome_falecido,
          patrimonio: data.valor_patrimonio,
          herdeiros_count: data.herdeiros.length,
          bens_count: data.bens.length,
        }
      });

      return caso;
    },
    onSuccess: (caso) => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      toast.success("Caso salvo com sucesso!");
      navigate(createPageUrl(`DetalheCaso?id=${caso.id}`));
    },
    onError: (error) => {
      console.error("Erro ao salvar caso:", error);
      toast.error("Erro ao salvar o caso. Verifique os dados e tente novamente.");
    }
  });

  const validateStep = (step) => {
    if (skipValidation) return true;

    const checkField = (value, validatorName, fieldId, label, isRequired = false) => {
      if (isRequired && (!value || (typeof value === "string" && !value.trim()))) {
        return { fieldId, message: `${label} é obrigatório` };
      }
      if (value && validators[validatorName]) {
        const result = validators[validatorName](value);
        if (!result.valid) return { fieldId, message: `${label}: ${result.message}` };
      }
      return null;
    };

    let firstError = null;

    switch (step) {
      case 1: { // Dados do Falecido
        const checks = [
          checkField(formData.nome_falecido, "nome", "nome_falecido", "Nome do Falecido", true),
          checkField(formData.cpf_falecido, "cpf", "cpf_falecido", "CPF do Falecido", true),
          checkField(formData.data_obito, null, "data_obito", "Data do Óbito", true),
          checkField(formData.rg, "rg", "rg", "RG do Falecido"),
          checkField(formData.cep, "cep", "cep", "CEP do Falecido"),
        ];
        firstError = checks.find(Boolean);
        if (firstError) {
          toast.error(firstError.message);
          scrollToError(firstError.fieldId);
          return false;
        }
        // Validar data do óbito não futura
        if (formData.data_obito) {
          const dataObito = new Date(formData.data_obito);
          const hoje = new Date();
          hoje.setHours(23, 59, 59, 999);
          if (dataObito > hoje) {
            toast.error("A data do óbito não pode ser uma data futura.");
            scrollToError("data_obito");
            return false;
          }
        }
        // Validar nascimento < óbito
        if (formData.data_nascimento && formData.data_obito) {
          if (new Date(formData.data_nascimento) > new Date(formData.data_obito)) {
            toast.error("Data de nascimento não pode ser posterior à data do óbito.");
            scrollToError("data_nascimento");
            return false;
          }
        }
        return true;
      }

      case 2: { // Dados do Cônjuge
        const checks = [
          checkField(formData.conjuge_nome, "nome", "conjuge_nome", "Nome do Cônjuge"),
          checkField(formData.conjuge_cpf, "cpf", "conjuge_cpf", "CPF do Cônjuge"),
          checkField(formData.conjuge_rg, "rg", "conjuge_rg", "RG do Cônjuge"),
          checkField(formData.conjuge_email, "email", "conjuge_email", "Email do Cônjuge"),
          checkField(formData.conjuge_telefone, "phone", "conjuge_telefone", "Telefone do Cônjuge"),
          checkField(formData.conjuge_cep, "cep", "conjuge_cep", "CEP do Cônjuge"),
        ];
        firstError = checks.find(Boolean);
        if (firstError) {
          toast.error(firstError.message);
          scrollToError(firstError.fieldId);
          return false;
        }
        return true;
      }

      case 3: { // Tipo Inventário — data de abertura/distribuição DEVE ser posterior ao óbito
        if (formData.tipo_inventario === 'extrajudicial' && formData.data_abertura_inventario && formData.data_obito) {
          if (new Date(formData.data_abertura_inventario) <= new Date(formData.data_obito)) {
            toast.error("Data de abertura do inventário deve ser posterior à data do óbito.");
            scrollToError("data_abertura_inventario");
            return false;
          }
        }
        if (formData.tipo_inventario === 'judicial' && formData.data_distribuicao && formData.data_obito) {
          if (new Date(formData.data_distribuicao) <= new Date(formData.data_obito)) {
            toast.error("Data de distribuição do processo deve ser posterior à data do óbito.");
            scrollToError("data_distribuicao");
            return false;
          }
        }
        return true;
      }

      case 4: { // Administrador Provisório
        const adm = formData.administrador_provisorio || {};
        const checksAdm = [
          checkField(adm.cpf, "cpf", "admin_cpf", "CPF do Administrador"),
          checkField(adm.email, "email", "admin_email", "Email do Administrador"),
          checkField(adm.telefone, "phone", "admin_telefone", "Telefone do Administrador"),
          checkField(adm.cep, "cep", "admin_cep", "CEP do Administrador"),
          checkField(adm.conjuge_cpf, "cpf", "admin_conjuge_cpf", "CPF do Cônjuge do Administrador"),
        ];
        firstError = checksAdm.find(Boolean);
        if (firstError) {
          toast.error(firstError.message);
          scrollToError(firstError.fieldId);
          return false;
        }
        // Adm. Provisório pode ser o cônjuge, herdeiro ou terceiro → CPF duplicado é permitido.
        // Apenas impede duplicata com o Falecido.
        const admCpfClean = adm.cpf?.replace(/\D/g, "");
        if (admCpfClean?.length === 11) {
          const falecidoCpf = formData.cpf_falecido?.replace(/\D/g, "");
          if (falecidoCpf === admCpfClean) {
            toast.error("CPF do Administrador Provisório não pode ser igual ao CPF do Falecido.");
            scrollToError("admin_cpf");
            return false;
          }
        }
        return true;
      }

      case 5: { // Herdeiros
        if (formData.herdeiros.length === 0) {
          toast.error("Adicione pelo menos um herdeiro para prosseguir.");
          return false;
        }
        for (let i = 0; i < formData.herdeiros.length; i++) {
          const h = formData.herdeiros[i];
          const checksH = [
            checkField(h.nome, "nome", `herdeiro_${i}_nome`, `Nome do Herdeiro ${i + 1}`, true),
            checkField(h.cpf, "cpf", `herdeiro_${i}_cpf`, `CPF do Herdeiro ${i + 1}`),
            checkField(h.rg, "rg", `herdeiro_${i}_rg`, `RG do Herdeiro ${i + 1}`),
            checkField(h.email, "email", `herdeiro_${i}_email`, `Email do Herdeiro ${i + 1}`),
            checkField(h.telefone, "phone", `herdeiro_${i}_telefone`, `Telefone do Herdeiro ${i + 1}`),
            checkField(h.cep, "cep", `herdeiro_${i}_cep`, `CEP do Herdeiro ${i + 1}`),
          ];
          firstError = checksH.find(Boolean);
          if (firstError) {
            toast.error(firstError.message);
            scrollToError(firstError.fieldId);
            return false;
          }

          // Cessão: exige nº da escritura
          if (h.cessao_tipo && h.cessao_tipo !== "nenhuma" && !h.numero_escritura_cessao?.trim()) {
            toast.error(`Herdeiro ${i + 1}: informe o nº da Escritura Pública de cessão.`);
            scrollToError(`herdeiro_${i}_escritura_cessao`);
            return false;
          }
          // Cessão onerosa: exige dados do cessionário
          if (h.cessao_tipo === "onerosa") {
            if (!h.cessionario_nome?.trim() || !h.cessionario_cpf?.trim()) {
              toast.error(`Herdeiro ${i + 1}: informe nome e CPF do cessionário.`);
              return false;
            }
            const cpfCheck = validators.cpf(h.cessionario_cpf);
            if (!cpfCheck.valid) {
              toast.error(`Herdeiro ${i + 1}: CPF do cessionário inválido.`);
              return false;
            }
          }
          // Renúncia: exige nº do documento
          if (h.renuncia_tipo && h.renuncia_tipo !== "nenhuma" && !h.numero_documento_renuncia?.trim()) {
            toast.error(`Herdeiro ${i + 1}: informe o nº do documento de renúncia.`);
            scrollToError(`herdeiro_${i}_doc_renuncia`);
            return false;
          }
        }
        return true;
      }

      case 6: { // Inventariante
        const inv = formData.inventariante || {};
        const checksInv = [
          checkField(inv.nome, "nome", "inv_nome", "Nome do Inventariante", true),
          checkField(inv.cpf_cnpj, "cpf", "inv_cpf_cnpj", "CPF/CNPJ do Inventariante", true),
          checkField(inv.data_nomeacao, null, "inv_data_nomeacao", "Data de Nomeação", true),
          checkField(inv.email, "email", "inv_email", "Email do Inventariante"),
          checkField(inv.telefone, "phone", "inv_telefone", "Telefone do Inventariante"),
        ];
        firstError = checksInv.find(Boolean);
        if (firstError) {
          toast.error(firstError.message);
          scrollToError(firstError.fieldId);
          return false;
        }
        return true;
      }

      case 7: { // Bens
        if (formData.bens.length === 0) {
            toast.warning("Atenção: Nenhum bem foi adicionado ao espólio.");
        }
        const invalidBemIdx = formData.bens.findIndex(b => !b.descricao || !b.valor || b.valor <= 0);
        if (invalidBemIdx >= 0) {
            const b = formData.bens[invalidBemIdx];
            const fieldId = !b.descricao ? `bem_${invalidBemIdx}_descricao` : `bem_${invalidBemIdx}_valor`;
            toast.error(`Bem ${invalidBemIdx + 1}: Verifique Descrição e Valor.`);
            scrollToError(fieldId);
            return false;
        }
        return true;
      }

      case 8: // Dívidas
        return true;

      default:
        return true;
    }
  };

  // Validar todas as etapas até a etapa alvo (para navegação clicável)
  const canNavigateToStep = (targetStep) => {
    if (skipValidation) return true;
    for (let s = 1; s < targetStep; s++) {
      if (!validateStepSilent(s)) return false;
    }
    return true;
  };

  // Validação silenciosa (sem toast/scroll) para checar se pode navegar
  const validateStepSilent = (step) => {
    if (skipValidation) return true;
    const checkRequired = (value) => !!(value && (typeof value !== "string" || value.trim()));
    
    switch (step) {
      case 1:
        return checkRequired(formData.nome_falecido) && checkRequired(formData.cpf_falecido) && checkRequired(formData.data_obito);
      case 2:
        return true; // Cônjuge é opcional
      case 3:
        return true; // Inventário é opcional
      case 4:
        return true; // Administrador é opcional  
      case 5:
        return formData.herdeiros.length > 0;
      case 6: {
        const inv = formData.inventariante || {};
        return checkRequired(inv.nome) && checkRequired(inv.cpf_cnpj) && checkRequired(inv.data_nomeacao);
      }
      case 7:
        return true;
      case 8:
        return true;
      default:
        return true;
    }
  };

  const [isCalculating, setIsCalculating] = useState(false);

  const calcularPartilha = async () => {
    setIsCalculating(true);
    try {
        // Primeiro, precisamos salvar temporariamente para calcular
        // Calculando patrimônio total dos bens
        const valorPatrimonio = formData.bens.reduce((sum, b) => sum + (parseFloat(b.valor) || 0), 0);
        
        setFormData(prev => ({
            ...prev,
            valor_patrimonio: valorPatrimonio
        }));

        // Se já temos um caso salvo, calcular partilha
        if (casoId) {
            const response = await base44.functions.invoke('calcularPartilhaHeranca', {
                caso_id: casoId
            });
            
            const { data } = response;
            if (data?.codigo === 'UFP_NAO_CADASTRADA') {
                toast.error(data.error, { duration: 8000 });
                return;
            }
            if (data?.codigo === 'REGRA_ITCMD_NAO_CADASTRADA') {
                toast.error(data.error, { duration: 8000 });
                return;
            }
            if (data && data.sucesso) {
                setResultadoPartilha(data);
                setFormData(prev => ({
                    ...prev,
                    valor_patrimonio: data.resumo.valor_patrimonio,
                    valor_meacao_conjuge: data.resumo.meacao_conjuge,
                    valor_heranca_conjuge: data.resumo.heranca_conjuge,
                    valor_heranca_filhos: data.resumo.heranca_filhos,
                    valor_itcmd: data.resumo.itcmd_total,
                    aliquota: data.resumo.aliquota || 4
                }));
                toast.success("Partilha calculada com sucesso!");
            }
        } else {
            // Para novo caso, fazer cálculo local simplificado
            const qtdFilhos = formData.herdeiros.filter(h => 
                ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco)
            ).length;
            const temFilhos = qtdFilhos > 0;
            const regimeBens = formData.regime_bens;
            const dataCasamento = formData.data_casamento ? new Date(formData.data_casamento) : null;

            let totalMeacao = 0;
            let totalHerancaConjuge = 0;
            let totalHerancaFilhos = 0;

            formData.bens.forEach(bem => {
                const valorBem = bem.valor || 0;
                const dataAquisicao = bem.data_aquisicao ? new Date(bem.data_aquisicao) : null;
                const origemBem = bem.origem_bem || 'onerosa';

                switch (regimeBens) {
                    case 'comunhao_parcial':
                    case 'uniao_estavel':
                        if (dataAquisicao && dataCasamento && dataAquisicao > dataCasamento && origemBem === 'onerosa') {
                            totalMeacao += valorBem * 0.50;
                            totalHerancaFilhos += valorBem * 0.50;
                        } else {
                            if (temFilhos) {
                                totalHerancaConjuge += valorBem / (qtdFilhos + 1);
                                totalHerancaFilhos += valorBem - (valorBem / (qtdFilhos + 1));
                            } else {
                                totalHerancaConjuge += valorBem;
                            }
                        }
                        break;
                    case 'comunhao_universal':
                        totalMeacao += valorBem * 0.50;
                        totalHerancaFilhos += valorBem * 0.50;
                        break;
                    case 'separacao_total':
                    case 'participacao_final':
                        if (temFilhos) {
                            totalHerancaConjuge += valorBem / (qtdFilhos + 1);
                            totalHerancaFilhos += valorBem - (valorBem / (qtdFilhos + 1));
                        } else {
                            totalHerancaConjuge += valorBem;
                        }
                        break;
                    case 'separacao_obrigatoria':
                        totalHerancaFilhos += valorBem;
                        break;
                    default:
                        totalHerancaFilhos += valorBem;
                }
            });

            // Regra dos 25%
            const totalHeranca = totalHerancaConjuge + totalHerancaFilhos;
            if (formData.conjuge_e_ascendente_herdeiros && temFilhos && 
                (regimeBens === 'comunhao_parcial' || regimeBens === 'separacao_total')) {
                const minimo25 = totalHeranca * 0.25;
                if (totalHerancaConjuge < minimo25) {
                    totalHerancaConjuge = minimo25;
                    totalHerancaFilhos = totalHeranca - minimo25;
                }
            }

            // Calcular ITCMD (4% padrão)
            const aliquota = 4;
            const itcmdTotal = (totalHerancaConjuge + totalHerancaFilhos) * (aliquota / 100);

            setFormData(prev => ({
                ...prev,
                valor_patrimonio: valorPatrimonio,
                valor_meacao_conjuge: totalMeacao,
                valor_heranca_conjuge: totalHerancaConjuge,
                valor_heranca_filhos: totalHerancaFilhos,
                valor_itcmd: itcmdTotal,
                aliquota: aliquota
            }));

            toast.success("Partilha calculada localmente. Salve o caso para cálculo definitivo.");
        }
    } catch (error) {
        console.error("Erro ao calcular partilha:", error);
        toast.error("Erro ao calcular partilha. Verifique os dados informados.");
    } finally {
        setIsCalculating(false);
    }
  };

  const scrollToTop = () => {
    setTimeout(() => {
      const el = document.getElementById('etapa-content');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const avancar = async () => {
    if (validateStep(etapaAtual)) {
      if (etapaAtual < ETAPAS.length) {
        const proximaEtapa = etapaAtual + 1;
        setEtapaAtual(proximaEtapa);
        scrollToTop();
        
        // Se for para o Resumo (Etapa 9), calcula a partilha
        if (proximaEtapa === 9) {
            await calcularPartilha();
        }
      }
    }
  };

  const voltar = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
      scrollToTop();
    }
  };

  const navegarParaEtapa = (etapaId) => {
    // Só permite navegar se todas as etapas anteriores estão válidas
    if (etapaId > etapaAtual && !canNavigateToStep(etapaId)) {
      toast.error("Preencha os campos obrigatórios das etapas anteriores para avançar.");
      return;
    }
    setEtapaAtual(etapaId);
    scrollToTop();
  };

  const salvar = () => {
    mutation.mutate(formData);
  };

  const EtapaComponente = ETAPAS[etapaAtual - 1].componente;

  return (
    <div className="min-h-screen">
      {/* Cabeçalho */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-4">
        <StepHeader
          titulo={isEditing ? "Editar Inventário" : "Novo Caso de Inventário"}
          subtitulo={isEditing ? "Atualize as informações do processo" : "Preencha as informações do processo"}
          backPath="FatoJuridico"
          backQuery="tab=inventarios"
          rightContent={
            <Button
              variant={skipValidation ? "destructive" : "outline"}
              size="sm"
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

      {/* Barra de etapas */}
      <StepNavigator
        etapas={ETAPAS}
        etapaAtual={etapaAtual}
        onNavigate={navegarParaEtapa}
        canNavigateTo={canNavigateToStep}
        colorClass="blue-900"
        sticky
      />

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8 pt-4">
        <StepContent id="etapa-content" titulo={ETAPAS[etapaAtual - 1].titulo}>
          <EtapaComponente 
            formData={formData} 
            setFormData={setFormData} 
            isCalculating={isCalculating} 
            resultadoPartilha={resultadoPartilha}
          />
        </StepContent>

        <StepActions
          etapaAtual={etapaAtual}
          totalEtapas={ETAPAS.length}
          onAvancar={avancar}
          onVoltar={voltar}
          onSalvar={salvar}
          isSaving={mutation.isPending}
          isSaved={mutation.isSuccess}
          isEditing={isEditing}
          saveLabel="Salvar Caso"
        />
      </div>
    </div>
  );
}