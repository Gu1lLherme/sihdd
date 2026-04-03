import React from "react";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RevisaoSection from "./RevisaoSection";

const SEXO_LABELS = { masculino: "Masculino", feminino: "Feminino" };
const REGIME_LABELS = {
  uniao_estavel: "União Estável", comunhao_universal: "Comunhão Universal",
  comunhao_parcial: "Comunhão Parcial", separacao_total: "Separação Total",
  separacao_obrigatoria: "Separação Obrigatória", participacao_final: "Participação Final"
};

function Row({ label, value, warn }) {
  if (!value && value !== 0 && value !== false) return null;
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm shrink-0 mr-4">{label}</span>
      <span className={`text-sm font-medium text-right ${warn ? 'text-amber-600' : 'text-slate-900'}`}>{value}</span>
    </div>
  );
}

export default function RevisaoDadosBasicos({ formData, onNavigate }) {
  const d = formData;
  const temConjuge = d.conjuge_nome;

  const missingFields = [];
  if (!d.nome_falecido) missingFields.push("Nome do Falecido");
  if (!d.cpf_falecido) missingFields.push("CPF do Falecido");
  if (!d.data_obito) missingFields.push("Data do Óbito");

  return (
    <RevisaoSection
      number={1}
      title="Dados Iniciais"
      icon={User}
      onNavigate={() => onNavigate(1)}
      missingFields={missingFields}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Falecido(a)</p>
          <Row label="Nome" value={d.nome_falecido} />
          <Row label="CPF" value={d.cpf_falecido} />
          <Row label="RG" value={d.rg} />
          <Row label="Órgão Expedidor" value={d.orgao_expedidor} />
          <Row label="Sexo" value={SEXO_LABELS[d.sexo]} />
          <Row label="Nacionalidade" value={d.nacionalidade} />
          <Row label="Profissão" value={d.profissao} />
          <Row label="Data Nascimento" value={d.data_nascimento} />
          <Row label="Data Óbito" value={d.data_obito} />
          <Row label="Horário Óbito" value={d.horario_obito} />
          <Row label="Local Óbito" value={d.local_obito} />
          <Row label="Endereço" value={d.endereco} />
          <Row label="CEP" value={d.cep} />
          <Row label="Filiação (Pai)" value={d.filiacao_pai} />
          <Row label="Filiação (Mãe)" value={d.filiacao_mae} />
          <Row label="Cert. Óbito Nº" value={d.certidao_obito_numero} />
          <Row label="Cartório Óbito" value={d.certidao_obito_cartorio} />
          {d.existencia_testamento && (
            <>
              <Row label="Testamento" value={d.testamento_tipo ? d.testamento_tipo.charAt(0).toUpperCase() + d.testamento_tipo.slice(1) : "Sim"} warn />
              <Row label="Cartório Testamento" value={d.testamento_cartorio} />
            </>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cônjuge / Companheiro(a)</p>
          {temConjuge ? (
            <>
              <Row label="Nome" value={d.conjuge_nome} />
              <Row label="CPF" value={d.conjuge_cpf} />
              <Row label="RG" value={d.conjuge_rg} />
              <Row label="Nacionalidade" value={d.conjuge_nacionalidade} />
              <Row label="Profissão" value={d.conjuge_profissao} />
              <Row label="Endereço" value={d.conjuge_endereco} />
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
            </>
          ) : (
            <p className="text-sm text-slate-400 italic py-2">Nenhum cônjuge informado</p>
          )}
        </div>
      </div>
    </RevisaoSection>
  );
}