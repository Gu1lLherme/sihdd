import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { masks } from "@/components/Masks";
import { User, UserPlus, Package, DollarSign } from "lucide-react";

export default function ResumoDoacao({ formData }) {
  const totalBens = (formData.bens || []).reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const tax = totalBens * 0.04;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-blue-500" />
              Doador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{formData.doador_nome}</p>
            <p className="text-sm text-gray-500">{formData.doador_cpf}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="w-5 h-5 text-green-500" />
              Donatário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{formData.donatario_nome}</p>
            <p className="text-sm text-gray-500">{formData.donatario_cpf}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-5 h-5 text-amber-500" />
            Bens ({formData.bens?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(formData.bens || []).map((bem, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                <span>{bem.descricao}</span>
                <span className="font-medium">{masks.currency(bem.valor * 100)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total dos Bens</span>
            <span className="text-xl font-bold">{masks.currency(totalBens * 100)}</span>
          </div>
          <div className="flex justify-between items-center text-blue-600">
            <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> ITCMD Estimado (4%)</span>
            <span className="text-xl font-bold">{masks.currency(tax * 100)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}