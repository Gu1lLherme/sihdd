import React, { useState } from "react";
import { TrendingUp } from "lucide-react";

// Imported components
import ParametrosSimulacao from "@/components/simulador/ParametrosSimulacao";
import ComparativoCenarios from "@/components/simulador/ComparativoCenarios";
import GraficoImpacto from "@/components/simulador/GraficoImpacto";

const ESTADOS = {
  SE: { nome: "Sergipe", aliquota_itcmd: 8, aliquota_itbi: 2 },
  SP: { nome: "São Paulo", aliquota_itcmd: 4, aliquota_itbi: 3 },
  RJ: { nome: "Rio de Janeiro", aliquota_itcmd: 5, aliquota_itbi: 2 },
  MG: { nome: "Minas Gerais", aliquota_itcmd: 5, aliquota_itbi: 3 },
};

export default function SimuladorPlanejamento() {
  const [valorPatrimonio, setValorPatrimonio] = useState(1000000);
  const [estado, setEstado] = useState("SE");
  const [numHerdeiros, setNumHerdeiros] = useState(2);
  const [percentualAdvocaticios, setPercentualAdvocaticios] = useState(5);

  const estadoInfo = ESTADOS[estado];

  // Cenário A - Inventário Tradicional
  const itcmd = (valorPatrimonio * estadoInfo.aliquota_itcmd) / 100;
  const honorariosA = (valorPatrimonio * percentualAdvocaticios) / 100;
  const custoCartorio = valorPatrimonio * 0.015; // 1.5%
  const totalInventario = itcmd + honorariosA + custoCartorio;

  // Cenário B - Holding
  const itbi = (valorPatrimonio * estadoInfo.aliquota_itbi) / 100;
  const custoConstituicao = 15000; // fixo
  const honorariosContabeis = 3000; // anual
  const totalHolding = itbi + custoConstituicao + honorariosContabeis;

  const economia = totalInventario - totalHolding;

  const chartData = [
    { name: "Inventário", value: totalInventario, color: "#DC2626" },
    { name: "Holding", value: totalHolding, color: "#16A34A" },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFC107] to-[#e6ac00] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Simulador de Planejamento</h1>
              <p className="text-amber-100 text-sm">Compare custos de Holding vs. Inventário Tradicional</p>
            </div>
          </div>
        </div>

        <ParametrosSimulacao 
          valorPatrimonio={valorPatrimonio}
          setValorPatrimonio={setValorPatrimonio}
          estado={estado}
          setEstado={setEstado}
          numHerdeiros={numHerdeiros}
          setNumHerdeiros={setNumHerdeiros}
          estados={ESTADOS}
        />

        <ComparativoCenarios 
          estadoInfo={estadoInfo}
          itcmd={itcmd}
          honorariosA={honorariosA}
          percentualAdvocaticios={percentualAdvocaticios}
          custoCartorio={custoCartorio}
          totalInventario={totalInventario}
          itbi={itbi}
          custoConstituicao={custoConstituicao}
          honorariosContabeis={honorariosContabeis}
          totalHolding={totalHolding}
        />

        <GraficoImpacto 
          chartData={chartData}
          economia={economia}
          totalInventario={totalInventario}
        />
      </div>
    </div>
  );
}