import React from "react";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RevisaoSection from "./RevisaoSection";

const REGIME_LABELS = {
  uniao_estavel: "União Estável", comunhao_universal: "Comunhão Universal",
  comunhao_parcial: "Comunhão Parcial", separacao_total: "Separação Total",
  separacao_obrigatoria: "Separação Obrigatória", participacao_final: "Participação Final"
};

function Row({ label, value }) {
  if (!value && value !== 0 && value !== false) return null;
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm shrink-0 mr-4">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function RevisaoConjuge({ formData, onNavigate }) {
  const d = formData;
  const temConjuge = d.conjuge_nome;

  return (
    <RevisaoSection number={2} title="Dados do Cônjuge" icon={User} onNavigate={() => onNavigate(2)}>
      {temConjuge ? (
        <div>
          <Row label="Nome" value={d.conjuge_nome} />
          <Row label="CPF" value={d.conjuge_cpf} />
          <Row label="RG" value={d.conjuge_rg} />
          <Row label="Nacionalidade" value={d.conjuge_nacionalidade} />
          <Row label="Profissão" value={d.conjuge_profissao} />
          <Row label="CEP" value={d.conjuge_cep} />
          <Row label="Telefone" value={d.conjuge_telefone} />
          <Row label="Email" value={d.conjuge_email} />
          <Row label="Regime de Bens" value={
            <Badge variant="outline" className="text-xs">
              {REGIME_LABELS[d.regime_bens] || d.regime_bens || "-"}
            </Badge>
          } />
          <Row label="Data Casamento" value={d.data_casamento} />
          <Row label="Ascendente dos Herdeiros" value={d.conjuge_e_ascendente_herdeiros ? "Sim" : "Não"} />
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic py-2">Nenhum cônjuge informado</p>
      )}
    </RevisaoSection>
  );
}