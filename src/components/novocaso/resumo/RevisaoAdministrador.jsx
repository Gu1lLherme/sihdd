import React from "react";
import { UserCheck } from "lucide-react";
import RevisaoSection from "./RevisaoSection";

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm shrink-0 mr-4">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function RevisaoAdministrador({ formData, onNavigate }) {
  const d = formData.administrador_provisorio || {};
  const preenchido = d.nome || d.cpf;

  return (
    <RevisaoSection number={4} title="Administrador Provisório" icon={UserCheck} onNavigate={() => onNavigate(4)}>
      {!preenchido ? (
        <p className="text-sm text-slate-400 italic py-2">Nenhum administrador provisório informado</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <Row label="Nome" value={d.nome} />
            <Row label="CPF" value={d.cpf} />
            <Row label="Email" value={d.email} />
            <Row label="Telefone" value={d.telefone} />
          </div>
          <div>
            <Row label="CEP" value={d.cep} />
            <Row label="Logradouro" value={d.logradouro} />
            <Row label="Nº" value={d.numero} />
            <Row label="Bairro" value={d.bairro} />
            <Row label="Cidade" value={d.cidade} />
            <Row label="UF" value={d.uf} />
          </div>
        </div>
      )}
    </RevisaoSection>
  );
}