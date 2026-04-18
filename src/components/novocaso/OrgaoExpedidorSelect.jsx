import React, { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ORGAOS_EXPEDIDORES = [
  { sigla: "SSP", nome: "Secretaria de Segurança Pública" },
  { sigla: "SDS", nome: "Secretaria de Defesa Social" },
  { sigla: "SEJUSP", nome: "Secretaria de Justiça e Segurança Pública" },
  { sigla: "PC", nome: "Polícia Civil" },
  { sigla: "PM", nome: "Polícia Militar" },
  { sigla: "CBM", nome: "Corpo de Bombeiros Militar" },
  { sigla: "DETRAN", nome: "Departamento de Trânsito" },
  { sigla: "DPF", nome: "Departamento de Polícia Federal" },
  { sigla: "IFP", nome: "Instituto Félix Pacheco" },
  { sigla: "ITEP", nome: "Instituto Técnico-Científico de Perícia" },
  { sigla: "IGP", nome: "Instituto Geral de Perícias" },
  { sigla: "IIPC", nome: "Instituto de Identificação da Polícia Civil" },
  { sigla: "SJS", nome: "Secretaria de Justiça e Segurança" },
  { sigla: "CTPS", nome: "Carteira de Trabalho e Previdência Social" },
  { sigla: "MD", nome: "Ministério da Defesa" },
  { sigla: "MEX", nome: "Ministério do Exército" },
  { sigla: "MAE", nome: "Ministério da Aeronáutica" },
  { sigla: "MM", nome: "Ministério da Marinha" },
  { sigla: "MTE", nome: "Ministério do Trabalho e Emprego" },
  { sigla: "OAB", nome: "Ordem dos Advogados do Brasil" },
  { sigla: "CREA", nome: "Conselho Regional de Engenharia e Agronomia" },
  { sigla: "CRM", nome: "Conselho Regional de Medicina" },
  { sigla: "CRO", nome: "Conselho Regional de Odontologia" },
  { sigla: "CRC", nome: "Conselho Regional de Contabilidade" },
  { sigla: "COREN", nome: "Conselho Regional de Enfermagem" },
  { sigla: "CRF", nome: "Conselho Regional de Farmácia" },
  { sigla: "CRP", nome: "Conselho Regional de Psicologia" },
  { sigla: "CREFITO", nome: "Conselho Regional de Fisioterapia e Terapia Ocupacional" },
  { sigla: "CONFEA", nome: "Conselho Federal de Engenharia e Agronomia" },
];

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function OrgaoExpedidorSelect({ value, onChange }) {
  // Estado interno para manter seleções parciais (antes de ambos estarem preenchidos)
  const initialParsed = useMemo(() => {
    if (!value) return { orgao: "", uf: "" };
    const parts = value.split("/");
    if (parts.length === 2) {
      return { orgao: parts[0].trim(), uf: parts[1].trim() };
    }
    // Valor sem "/" — pode ser só o órgão
    const orgaoMatch = ORGAOS_EXPEDIDORES.find(o => o.sigla === value.trim());
    if (orgaoMatch) return { orgao: value.trim(), uf: "" };
    return { orgao: "", uf: "" };
  }, []);

  const [orgao, setOrgao] = useState(initialParsed.orgao);
  const [uf, setUf] = useState(initialParsed.uf);

  // Sincroniza com valor externo quando muda (ex: edição)
  useEffect(() => {
    if (!value) { setOrgao(""); setUf(""); return; }
    const parts = value.split("/");
    if (parts.length === 2) {
      setOrgao(parts[0].trim());
      setUf(parts[1].trim());
    }
  }, [value]);

  const handleOrgaoChange = (newOrgao) => {
    setOrgao(newOrgao);
    if (newOrgao && uf) {
      onChange(`${newOrgao}/${uf}`);
    }
  };

  const handleUfChange = (newUf) => {
    setUf(newUf);
    if (orgao && newUf) {
      onChange(`${orgao}/${newUf}`);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Órgão Expedidor</Label>
      <div className="grid grid-cols-2 gap-2">
        <Select value={orgao} onValueChange={handleOrgaoChange}>
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
        <Select value={uf} onValueChange={handleUfChange}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="UF" />
          </SelectTrigger>
          <SelectContent>
            {UFS.map(u => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {orgao && !uf && (
        <p className="text-xs text-amber-600">Selecione a UF para completar</p>
      )}
      {!orgao && uf && (
        <p className="text-xs text-amber-600">Selecione o órgão para completar</p>
      )}
    </div>
  );
}