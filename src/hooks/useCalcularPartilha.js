import { useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import {
  partilharBem,
  aplicarRegra25Percent,
  DESCENDENTES,
  round2,
} from "@/lib/itcmd/calcularPartilhaCore";

/**
 * Hook que encapsula:
 *  - Cálculo remoto (quando casoId existe) via backend function
 *  - Preview local (para novo caso) usando a MESMA lib compartilhada
 */
export function useCalcularPartilha({ casoId, formData, setFormData, setResultadoPartilha }) {
  const [isCalculating, setIsCalculating] = useState(false);

  const calcularRemoto = async () => {
    const { data } = await base44.functions.invoke("calcularPartilhaHeranca", { caso_id: casoId });

    if (data?.codigo === "UFP_NAO_CADASTRADA" || data?.codigo === "REGRA_ITCMD_NAO_CADASTRADA") {
      toast.error(data.error, { duration: 8000 });
      return;
    }
    if (data?.sucesso) {
      setResultadoPartilha(data);
      setFormData((prev) => ({
        ...prev,
        valor_patrimonio: data.resumo.valor_patrimonio,
        valor_meacao_conjuge: data.resumo.meacao_conjuge,
        valor_heranca_conjuge: data.resumo.heranca_conjuge,
        valor_heranca_filhos: data.resumo.heranca_filhos,
        valor_itcmd: data.resumo.itcmd_total,
        aliquota: data.resumo.aliquota || 4,
      }));
      toast.success("Partilha calculada com sucesso!");
    }
  };

  const calcularLocal = () => {
    const patrimonio = formData.bens.reduce((s, b) => s + (parseFloat(b.valor) || 0), 0);
    const filhos = formData.herdeiros.filter((h) => DESCENDENTES.includes(h.parentesco));
    const qtdFilhos = filhos.length;
    const temFilhos = qtdFilhos > 0;
    const conjugeParticipa = !!formData.conjuge_nome;

    let totalMeacao = 0, totalHC = 0, totalHF = 0;
    formData.bens.forEach((bem) => {
      const r = partilharBem({
        valorBem: bem.valor || 0,
        regimeBens: formData.regime_bens,
        dataAquisicao: bem.data_aquisicao,
        dataCasamento: formData.data_casamento,
        origemBem: bem.origem_bem,
        temFilhos, qtdFilhos, conjugeParticipa,
      });
      totalMeacao += r.meacao; totalHC += r.herancaConjuge; totalHF += r.herancaFilhos;
    });

    const r25 = aplicarRegra25Percent({
      regimeBens: formData.regime_bens,
      conjugeEAscendenteHerdeiros: formData.conjuge_e_ascendente_herdeiros,
      todosFilhosSaoDoConjuge: filhos.every((f) => f.e_filho_conjuge !== false),
      temFilhos, conjugeParticipa,
      totalHerancaConjuge: totalHC, totalHerancaFilhos: totalHF,
    });

    // Preview local: usa 4% apenas como orientação (cálculo definitivo usa legislação vigente no backend)
    const aliquotaPreview = 4;
    const itcmdPreview = (r25.herancaConjuge + r25.herancaFilhos) * (aliquotaPreview / 100);

    setFormData((prev) => ({
      ...prev,
      valor_patrimonio: round2(patrimonio),
      valor_meacao_conjuge: round2(totalMeacao),
      valor_heranca_conjuge: round2(r25.herancaConjuge),
      valor_heranca_filhos: round2(r25.herancaFilhos),
      valor_itcmd: round2(itcmdPreview),
      aliquota: aliquotaPreview,
    }));

    toast.success("Partilha calculada localmente. Salve o caso para cálculo definitivo.");
  };

  const calcular = async () => {
    setIsCalculating(true);
    try {
      if (casoId) await calcularRemoto();
      else calcularLocal();
    } catch (error) {
      console.error("Erro ao calcular partilha:", error);
      toast.error("Erro ao calcular partilha. Verifique os dados informados.");
    } finally {
      setIsCalculating(false);
    }
  };

  return { calcular, isCalculating };
}