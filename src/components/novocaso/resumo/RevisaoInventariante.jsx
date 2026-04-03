import React from "react";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RevisaoSection from "./RevisaoSection";

const VINCULO = { conjuge: "Cônjuge", herdeiro: "Herdeiro", dativo: "Dativo", testamenteiro: "Testamenteiro", outro: "Outro" };

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm shrink-0 mr-4">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function RevisaoInventariante({ formData, onNavigate }) {
  const d = formData.inventariante || {};
  const missingFields = [];
  if (!d.nome) missingFields.push("Nome do Inventariante");
  if (!d.cpf_cnpj) missingFields.push("CPF/CNPJ");
  if (!d.data_nomeacao) missingFields.push("Data de Nomeação");

  return (
    <RevisaoSection number={6} title="Inventariante" icon={Building2} onNavigate={() => onNavigate(6)} missingFields={missingFields}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <Row label="Nome" value={d.nome} />
          <Row label="CPF/CNPJ" value={d.cpf_cnpj} />
          <Row label="Email" value={d.email} />
          <Row label="Telefone" value={d.telefone} />
        </div>
        <div>
          <Row label="Data Nomeação" value={d.data_nomeacao} />
          <Row label="Vínculo" value={VINCULO[d.vinculo] || d.vinculo} />
          <Row label="CEP" value={d.cep} />
          <Row label="Endereço" value={[d.logradouro, d.numero, d.bairro, d.cidade, d.uf].filter(Boolean).join(", ")} />
        </div>
      </div>
    </RevisaoSection>
  );
}