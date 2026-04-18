import { toast } from "sonner";
import { validators } from "@/components/validations";
import { scrollToError } from "@/components/novocaso/scrollToError";

/**
 * Hook de validação de etapas do NovoCaso.
 * Mantém a mesma lógica anterior — apenas extraída para isolar responsabilidade.
 */
export function useValidacaoEtapa(formData, skipValidation) {

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

  const validateStep = (step) => {
    if (skipValidation) return true;
    let firstError = null;

    switch (step) {
      case 1: {
        const checks = [
          checkField(formData.nome_falecido, "nome", "nome_falecido", "Nome do Falecido", true),
          checkField(formData.cpf_falecido, "cpf", "cpf_falecido", "CPF do Falecido", true),
          checkField(formData.data_obito, null, "data_obito", "Data do Óbito", true),
          checkField(formData.rg, "rg", "rg", "RG do Falecido"),
          checkField(formData.cep, "cep", "cep", "CEP do Falecido"),
        ];
        firstError = checks.find(Boolean);
        if (firstError) { toast.error(firstError.message); scrollToError(firstError.fieldId); return false; }
        if (formData.data_obito) {
          const hoje = new Date(); hoje.setHours(23, 59, 59, 999);
          if (new Date(formData.data_obito) > hoje) {
            toast.error("A data do óbito não pode ser uma data futura.");
            scrollToError("data_obito"); return false;
          }
        }
        if (formData.data_nascimento && formData.data_obito &&
            new Date(formData.data_nascimento) > new Date(formData.data_obito)) {
          toast.error("Data de nascimento não pode ser posterior à data do óbito.");
          scrollToError("data_nascimento"); return false;
        }
        return true;
      }

      case 2: {
        const checks = [
          checkField(formData.conjuge_nome, "nome", "conjuge_nome", "Nome do Cônjuge"),
          checkField(formData.conjuge_cpf, "cpf", "conjuge_cpf", "CPF do Cônjuge"),
          checkField(formData.conjuge_rg, "rg", "conjuge_rg", "RG do Cônjuge"),
          checkField(formData.conjuge_email, "email", "conjuge_email", "Email do Cônjuge"),
          checkField(formData.conjuge_telefone, "phone", "conjuge_telefone", "Telefone do Cônjuge"),
          checkField(formData.conjuge_cep, "cep", "conjuge_cep", "CEP do Cônjuge"),
        ];
        firstError = checks.find(Boolean);
        if (firstError) { toast.error(firstError.message); scrollToError(firstError.fieldId); return false; }
        return true;
      }

      case 3: {
        if (formData.tipo_inventario === 'extrajudicial' && formData.data_abertura_inventario && formData.data_obito &&
            new Date(formData.data_abertura_inventario) <= new Date(formData.data_obito)) {
          toast.error("Data de abertura do inventário deve ser posterior à data do óbito.");
          scrollToError("data_abertura_inventario"); return false;
        }
        if (formData.tipo_inventario === 'judicial' && formData.data_distribuicao && formData.data_obito &&
            new Date(formData.data_distribuicao) <= new Date(formData.data_obito)) {
          toast.error("Data de distribuição do processo deve ser posterior à data do óbito.");
          scrollToError("data_distribuicao"); return false;
        }
        return true;
      }

      case 4: {
        const adm = formData.administrador_provisorio || {};
        const checksAdm = [
          checkField(adm.cpf, "cpf", "admin_cpf", "CPF do Administrador"),
          checkField(adm.email, "email", "admin_email", "Email do Administrador"),
          checkField(adm.telefone, "phone", "admin_telefone", "Telefone do Administrador"),
          checkField(adm.cep, "cep", "admin_cep", "CEP do Administrador"),
          checkField(adm.conjuge_cpf, "cpf", "admin_conjuge_cpf", "CPF do Cônjuge do Administrador"),
        ];
        firstError = checksAdm.find(Boolean);
        if (firstError) { toast.error(firstError.message); scrollToError(firstError.fieldId); return false; }
        const admCpfClean = adm.cpf?.replace(/\D/g, "");
        if (admCpfClean?.length === 11 && formData.cpf_falecido?.replace(/\D/g, "") === admCpfClean) {
          toast.error("CPF do Administrador Provisório não pode ser igual ao CPF do Falecido.");
          scrollToError("admin_cpf"); return false;
        }
        return true;
      }

      case 5: {
        if (formData.herdeiros.length === 0) {
          toast.error("Adicione pelo menos um herdeiro para prosseguir."); return false;
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
          if (firstError) { toast.error(firstError.message); scrollToError(firstError.fieldId); return false; }

          if (h.cessao_tipo && h.cessao_tipo !== "nenhuma" && !h.numero_escritura_cessao?.trim()) {
            toast.error(`Herdeiro ${i + 1}: informe o nº da Escritura Pública de cessão.`);
            scrollToError(`herdeiro_${i}_escritura_cessao`); return false;
          }
          if (h.cessao_tipo === "onerosa") {
            if (!h.cessionario_nome?.trim() || !h.cessionario_cpf?.trim()) {
              toast.error(`Herdeiro ${i + 1}: informe nome e CPF do cessionário.`); return false;
            }
            if (!validators.cpf(h.cessionario_cpf).valid) {
              toast.error(`Herdeiro ${i + 1}: CPF do cessionário inválido.`); return false;
            }
          }
          if (h.renuncia_tipo && h.renuncia_tipo !== "nenhuma" && !h.numero_documento_renuncia?.trim()) {
            toast.error(`Herdeiro ${i + 1}: informe o nº do documento de renúncia.`);
            scrollToError(`herdeiro_${i}_doc_renuncia`); return false;
          }
        }
        return true;
      }

      case 6: {
        const inv = formData.inventariante || {};
        const checksInv = [
          checkField(inv.nome, "nome", "inv_nome", "Nome do Inventariante", true),
          checkField(inv.cpf_cnpj, "cpf", "inv_cpf_cnpj", "CPF/CNPJ do Inventariante", true),
          checkField(inv.data_nomeacao, null, "inv_data_nomeacao", "Data de Nomeação", true),
          checkField(inv.email, "email", "inv_email", "Email do Inventariante"),
          checkField(inv.telefone, "phone", "inv_telefone", "Telefone do Inventariante"),
        ];
        firstError = checksInv.find(Boolean);
        if (firstError) { toast.error(firstError.message); scrollToError(firstError.fieldId); return false; }
        return true;
      }

      case 7: {
        if (formData.bens.length === 0) toast.warning("Atenção: Nenhum bem foi adicionado ao espólio.");
        const idx = formData.bens.findIndex(b => !b.descricao || !b.valor || b.valor <= 0);
        if (idx >= 0) {
          const b = formData.bens[idx];
          const fieldId = !b.descricao ? `bem_${idx}_descricao` : `bem_${idx}_valor`;
          toast.error(`Bem ${idx + 1}: Verifique Descrição e Valor.`);
          scrollToError(fieldId); return false;
        }
        return true;
      }

      default: return true;
    }
  };

  const validateStepSilent = (step) => {
    if (skipValidation) return true;
    const hasValue = (v) => !!(v && (typeof v !== "string" || v.trim()));
    switch (step) {
      case 1: return hasValue(formData.nome_falecido) && hasValue(formData.cpf_falecido) && hasValue(formData.data_obito);
      case 5: return formData.herdeiros.length > 0;
      case 6: {
        const inv = formData.inventariante || {};
        return hasValue(inv.nome) && hasValue(inv.cpf_cnpj) && hasValue(inv.data_nomeacao);
      }
      default: return true;
    }
  };

  const canNavigateToStep = (targetStep) => {
    if (skipValidation) return true;
    for (let s = 1; s < targetStep; s++) if (!validateStepSilent(s)) return false;
    return true;
  };

  return { validateStep, validateStepSilent, canNavigateToStep };
}