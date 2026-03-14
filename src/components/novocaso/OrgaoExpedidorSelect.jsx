import React, { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ORGAOS_EXPEDIDORES = [
  { sigla: "SSP", nome: "Secretaria de Segurança Pública" },
  { sigla: "PC", nome: "Polícia Civil" },
  { sigla: "IFP", nome: "Instituto Félix Pacheco" },
  { sigla: "ITEP", nome: "Instituto Técnico-Científico de Perícia" },
  { sigla: "IGP", nome: "Instituto Geral de Perícias" },
  { sigla: "DETRAN", nome: "Departamento de Trânsito" },
  { sigla: "CTPS", nome: "Carteira de Trabalho e Previdência Social" },
  { sigla: "CREA", nome: "Conselho Regional de Engenharia e Agronomia" },
  { sigla: "CRM", nome: "Conselho Regional de Medicina" },
  { sigla: "CRO", nome: "Conselho Regional de Odontologia" },
  { sigla: "OAB", nome: "Ordem dos Advogados do Brasil" },
  { sigla: "CRC", nome: "Conselho Regional de Contabilidade" },
  { sigla: "COREN", nome: "Conselho Regional de Enfermagem" },
  { sigla: "CRF", nome: "Conselho Regional de Farmácia" },
  { sigla: "CRP", nome: "Conselho Regional de Psicologia" },
  { sigla: "CREFITO", nome: "Conselho Regional de Fisioterapia e Terapia Ocupacional" },
  { sigla: "CONFEA", nome: "Conselho Federal de Engenharia e Agronomia" },
  { sigla: "MD", nome: "Ministério da Defesa" },
  { sigla: "MEX", nome: "Ministério do Exército" },
  { sigla: "MAE", nome: "Ministério da Aeronáutica" },
  { sigla: "MM", nome: "Ministério da Marinha" },
  { sigla: "MTE", nome: "Ministério do Trabalho e Emprego" },
  { sigla: "DPF", nome: "Departamento de Polícia Federal" },
  { sigla: "SDS", nome: "Secretaria de Defesa Social" },
  { sigla: "SESP", nome: "Secretaria de Estado de Segurança Pública" },
  { sigla: "SEJUSP", nome: "Secretaria de Justiça e Segurança Pública" },
  { sigla: "SJS", nome: "Secretaria de Justiça e Segurança" },
  { sigla: "IIPC", nome: "Instituto de Identificação da Polícia Civil" },
  { sigla: "CBM", nome: "Corpo de Bombeiros Militar" },
  { sigla: "PM", nome: "Polícia Militar" },
];

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function OrgaoExpedidorSelect({ value, onChange }) {
  // Parseia o valor existente (ex: "SSP/SE" -> orgao="SSP", uf="SE")
  const parsed = useMemo(() => {
    if (!value) return { orgao: "", uf: "" };
    const parts = value.split("/");
    if (parts.length === 2) {
      const orgaoMatch = ORGAOS_EXPEDIDORES.find(o => o.sigla === parts[0].trim());
      const ufMatch = UFS.includes(parts[1].trim());
      if (orgaoMatch && ufMatch) return { orgao: parts[0].trim(), uf: parts[1].trim() };
    }
    return { orgao: "", uf: "" };
  }, [value]);

  const handleOrgaoChange = (orgao) => {
    const newValue = orgao && parsed.uf ? `${orgao}/${parsed.uf}` : orgao || "";
    onChange(newValue);
  };

  const handleUfChange = (uf) => {
    const newValue = parsed.orgao && uf ? `${parsed.orgao}/${uf}` : "";
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label>Órgão Expedidor</Label>
      <div className="grid grid-cols-2 gap-2">
        <Select value={parsed.orgao || ""} onValueChange={handleOrgaoChange}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Órgão" />
          </SelectTrigger>
          <SelectContent>
            {ORGAOS_EXPEDIDORES.map(o => (
              <SelectItem key={o.sigla} value={o.sigla}>
                <span className="font-medium">{o.sigla}</span>
                <span className="text-muted-foreground text-xs ml-1">- {o.nome}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={parsed.uf || ""} onValueChange={handleUfChange}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="UF" />
          </SelectTrigger>
          <SelectContent>
            {UFS.map(uf => (
              <SelectItem key={uf} value={uf}>{uf}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {value && !parsed.orgao && (
        <p className="text-xs text-amber-600">Selecione o órgão e a UF para validar</p>
      )}
    </div>
  );
}