import React from "react";
import { ClipboardList } from "lucide-react";
import RevisaoSection from "./RevisaoSection";

const TIPO_INV = { extrajudicial: "Extrajudicial", judicial: "Judicial" };
const TIPO_PROC = { inventario: "Inventário", sobrepartilha: "Sobrepartilha" };
const CESSAO = { nenhuma: "Nenhuma", onerosa: "Onerosa", nao_onerosa: "Não Onerosa" };
const RENUNCIA = { nenhuma: "Nenhuma", termo_judicial: "Por Termo Judicial", escritura_publica: "Por Escritura Pública" };
const ESTADO_CIVIL = {
  solteiro: "Solteiro(a)", casado: "Casado(a)", divorciado: "Divorciado(a)",
  viuvo: "Viúvo(a)", uniao_estavel: "União Estável", separado_judicialmente: "Separado(a) Judicialmente"
};

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm shrink-0 mr-4">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function RevisaoInventario({ formData, onNavigate }) {
  const d = formData;
  const tipoInv = d.tipo_inventario || 'extrajudicial';
  const tipoProc = d.tipo_processo || 'inventario';

  return (
    <RevisaoSection number={3} title="Tipo de Inventário" icon={ClipboardList} onNavigate={() => onNavigate(3)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <Row label="Tipo Inventário" value={TIPO_INV[tipoInv]} />
          <Row label="Tipo Processo" value={TIPO_PROC[tipoProc]} />
          <Row label="Estado Civil" value={ESTADO_CIVIL[d.estado_civil]} />
          <Row label="Cessão de Direitos" value={CESSAO[d.cessao_direitos]} />
          <Row label="Renúncia Abdicativa" value={RENUNCIA[d.renuncia_abdicativa]} />
        </div>
        <div>
          {tipoInv === 'extrajudicial' && (
            <>
              <Row label="Data Abertura" value={d.data_abertura_inventario} />
              <Row label="Cartório" value={d.cartorio_nome} />
              <Row label="Município" value={d.cartorio_municipio} />
              <Row label="Ofício" value={d.cartorio_comarca} />
            </>
          )}
          {tipoInv === 'judicial' && (
            <>
              <Row label="Data Distribuição" value={d.data_distribuicao} />
              <Row label="Processo Nº" value={d.numero_processo_judicial} />
              <Row label="Vara / Comarca" value={d.vara_comarca} />
              <Row label="Homologação" value={d.data_homologacao_partilha} />
              <Row label="Trânsito Julgado" value={d.data_transito_julgado} />
            </>
          )}
          {tipoProc === 'sobrepartilha' && tipoInv === 'judicial' && (
            <>
              <Row label="Sobrepartilha Nº" value={d.numero_sobrepartilha} />
              <Row label="Vara Sobrepartilha" value={d.vara_comarca_sobrepartilha} />
            </>
          )}
        </div>
      </div>
    </RevisaoSection>
  );
}