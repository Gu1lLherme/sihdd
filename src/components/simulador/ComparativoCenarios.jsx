import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building } from "lucide-react";

export default function ComparativoCenarios({ 
  estadoInfo, 
  itcmd, 
  honorariosA, 
  percentualAdvocaticios, 
  custoCartorio, 
  totalInventario, 
  itbi, 
  custoConstituicao, 
  honorariosContabeis, 
  totalHolding 
}) {
  return (
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
  );
}