import React from "react";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RevisaoSection from "./RevisaoSection";

const PARENTESCO = {
  conjuge: "Cônjuge", filho: "Filho", filha: "Filha", pai: "Pai", mae: "Mãe",
  irmao: "Irmão", irma: "Irmã", neto: "Neto", neta: "Neta",
  sobrinho: "Sobrinho", sobrinha: "Sobrinha", tio: "Tio", tia: "Tia", outro: "Outro"
};

const CONDICAO = {
  nenhuma: null, menor: "Menor", menor_emancipado: "Menor Emancipado",
  incapacidade_temporaria: "Incapaz Temporário", interditado: "Interditado",
  curatela: "Curatela", ausente: "Ausente", nascituro: "Nascituro", herdeiro_excluido: "Excluído"
};

export default function RevisaoHerdeiros({ formData, onNavigate }) {
  const herdeiros = formData.herdeiros || [];
  const missingFields = herdeiros.length === 0 ? ["Ao menos 1 herdeiro"] : [];

  return (
    <RevisaoSection number={5} title={`Herdeiros (${herdeiros.length})`} icon={Users} onNavigate={() => onNavigate(5)} missingFields={missingFields}>
      {herdeiros.length === 0 ? (
        <p className="text-sm text-slate-400 italic py-2">Nenhum herdeiro cadastrado</p>
      ) : (
        <div className="space-y-3">
          {herdeiros.map((h, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                  <span className="font-semibold text-slate-900">{h.nome || "—"}</span>
                  <Badge variant="outline" className="capitalize text-xs">{PARENTESCO[h.parentesco] || h.parentesco}</Badge>
                  {h.condicao_especial && CONDICAO[h.condicao_especial] && (
                    <Badge variant="secondary" className="text-xs">{CONDICAO[h.condicao_especial]}</Badge>
                  )}
                  {h.e_filho_conjuge === false && <Badge variant="secondary" className="text-xs">Enteado</Badge>}
                </div>
                <span className="text-sm font-bold text-blue-800">{(h.percentual_partilha || 0).toFixed(2)}%</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
                {h.cpf && <span className="truncate">CPF: {h.cpf}</span>}
                {h.rg && <span className="truncate">RG: {h.rg}</span>}
                {h.cnh && <span className="truncate">CNH: {h.cnh}</span>}
                {h.data_nascimento && <span className="truncate">Nasc: {h.data_nascimento}</span>}
                {h.email && <span className="truncate break-all" title={h.email}>Email: {h.email}</span>}
                {h.telefone && <span className="truncate">Tel: {h.telefone}</span>}
                {h.estado_civil && <span className="truncate">Est. Civil: {h.estado_civil}</span>}
              </div>
              {h.condicao_especial && h.condicao_especial !== 'nenhuma' && h.representante_legal_nome && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-500">
                  <span className="font-medium">Representante:</span> {h.representante_legal_nome} (CPF: {h.representante_legal_cpf || '—'})
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </RevisaoSection>
  );
}