import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, AlertCircle } from "lucide-react";
import { masks } from "@/components/Masks";

export default function FormDonatario({ data, onChange }) {
  const nomeVazio = !data.donatario_nome?.trim();
  const cpfVazio = !data.donatario_cpf?.trim();

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="w-5 h-5 text-green-500" />
          Dados do Donatário
        </CardTitle>
        {(nomeVazio || cpfVazio) && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">Preencha todos os campos obrigatórios (*) para avançar.</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome Completo <span className="text-red-500">*</span></Label>
          <Input 
            value={data.donatario_nome || ""} 
            onChange={(e) => onChange("donatario_nome", e.target.value)}
            placeholder="Nome do donatário"
            className={nomeVazio ? "border-red-300 focus:border-red-500" : ""}
          />
          {nomeVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
        </div>
        <div className="space-y-2">
          <Label>CPF <span className="text-red-500">*</span></Label>
          <Input 
            value={data.donatario_cpf || ""} 
            onChange={(e) => onChange("donatario_cpf", masks.cpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14}
            className={cpfVazio ? "border-red-300 focus:border-red-500" : ""}
          />
          {cpfVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
        </div>
      </CardContent>
    </Card>
  );
}