import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { masks } from "@/components/Masks";
import { UserMinus, UserPlus, Scale, DollarSign } from "lucide-react";

export default function ResumoDivorcio({ formData }) {
  const regimeLabels = {
    uniao_estavel: "União Estável",
    comunhao_universal: "Comunhão Universal",
    comunhao_parcial: "Comunhão Parcial",
    separacao_total: "Separação Total",
    participacao_final: "Participação Final de Aquestos"
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserMinus className="w-5 h-5 text-blue-500" />
              Cônjuge Doador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{formData.conjuge_doador_nome}</p>
            <p className="text-sm text-gray-500">{formData.conjuge_doador_cpf}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="w-5 h-5 text-green-500" />
              Cônjuge Donatário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{formData.conjuge_donatario_nome}</p>
            <p className="text-sm text-gray-500">{formData.conjuge_donatario_cpf}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="w-5 h-5 text-purple-500" />
            Dados Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <p className="text-sm text-gray-500 mb-1">Regime de Bens</p>
                <p className="font-medium">{regimeLabels[formData.regime_bens] || formData.regime_bens || "Não informado"}</p>
             </div>
             <div>
                <p className="text-sm text-gray-500 mb-1">Excesso de Meação</p>
                <p className="font-medium">{formData.valor_excesso_meacao ? masks.currency(masks.currencyToNumber(formData.valor_excesso_meacao) * 100) : "R$ 0,00"}</p>
             </div>
             <div>
                <p className="text-sm text-gray-500 mb-1">Tributo (ITCMD)</p>
                <p className="font-bold text-purple-600">{formData.valor_tributo ? masks.currency(formData.valor_tributo * 100) : "R$ 0,00"}</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}