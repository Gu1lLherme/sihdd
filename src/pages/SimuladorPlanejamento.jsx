import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Building, FileText, DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

        {/* Input Parameters */}
        <Card className="border-2 border-[#FFC107] mb-6">
          <CardHeader className="bg-amber-50 border-b-2 border-[#FFC107]">
            <CardTitle className="text-[#333333]">Parâmetros da Simulação</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="valor">Valor Total do Patrimônio</Label>
                <Input
                  id="valor"
                  type="number"
                  value={valorPatrimonio}
                  onChange={(e) => setValorPatrimonio(Number(e.target.value))}
                  className="text-lg font-bold"
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado/Região</Label>
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ESTADOS).map(([uf, info]) => (
                      <SelectItem key={uf} value={uf}>
                        {info.nome} (ITCMD {info.aliquota_itcmd}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="herdeiros">Número de Herdeiros</Label>
                <Input
                  id="herdeiros"
                  type="number"
                  value={numHerdeiros}
                  onChange={(e) => setNumHerdeiros(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Scenario A - Probate */}
          <Card className="border-t-8 border-red-700">
            <CardHeader className="bg-red-50 border-b-2 border-red-700">
              <CardTitle className="flex items-center gap-2 text-[#333333]">
                <FileText className="w-6 h-6 text-red-700" />
                Cenário A: Inventário/Partilha
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#333333] font-medium">Imposto ITCMD ({estadoInfo.aliquota_itcmd}%)</span>
                <span className="font-bold text-red-700">R$ {itcmd.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#333333] font-medium">Honorários Advocatícios ({percentualAdvocaticios}%)</span>
                <span className="font-bold text-red-700">R$ {honorariosA.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#333333] font-medium">Custas Judiciais/Cartório (1.5%)</span>
                <span className="font-bold text-red-700">R$ {custoCartorio.toLocaleString('pt-BR')}</span>
              </div>
              <div className="bg-red-100 rounded-xl p-4 mt-6">
                <p className="text-sm text-[#AAAAAA] mb-1">Custo Total</p>
                <p className="text-3xl font-extrabold text-red-700">R$ {totalInventario.toLocaleString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Scenario B - Holding */}
          <Card className="border-t-8 border-green-600">
            <CardHeader className="bg-green-50 border-b-2 border-green-600">
              <CardTitle className="flex items-center gap-2 text-[#333333]">
                <Building className="w-6 h-6 text-green-600" />
                Cenário B: Holding/Doação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#333333] font-medium">Imposto ITBI ({estadoInfo.aliquota_itbi}%)</span>
                <span className="font-bold text-green-600">R$ {itbi.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#333333] font-medium">Custos de Abertura</span>
                <span className="font-bold text-green-600">R$ {custoConstituicao.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-[#333333] font-medium">Honorários Contábeis/Jurídicos (anual)</span>
                <span className="font-bold text-green-600">R$ {honorariosContabeis.toLocaleString('pt-BR')}</span>
              </div>
              <div className="bg-green-100 rounded-xl p-4 mt-6">
                <p className="text-sm text-[#AAAAAA] mb-1">Custo Total</p>
                <p className="text-3xl font-extrabold text-green-600">R$ {totalHolding.toLocaleString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <Card className="border-2 border-[#FFC107] bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardHeader className="border-b-2 border-[#FFC107]">
            <CardTitle className="flex items-center gap-2 text-[#333333]">
              <PieChartIcon className="w-6 h-6 text-[#FFC107]" />
              Análise de Impacto Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 shadow-2xl text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white text-lg font-bold mb-2">Economia Gerada</p>
                  <p className="text-5xl font-extrabold text-white mb-4">
                    R$ {economia.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-green-100 text-sm">
                    {economia > 0 ? `Economize ${((economia/totalInventario)*100).toFixed(1)}% escolhendo Holding` : 'Inventário tradicional é mais barato neste caso'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}