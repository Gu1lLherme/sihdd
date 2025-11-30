import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { masks } from "@/components/Masks";

export default function FormDonatario({ data, onChange }) {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="w-5 h-5 text-green-500" />
          Dados do Donatário
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome Completo</Label>
          <Input 
            value={data.donatario_nome || ""} 
            onChange={(e) => onChange("donatario_nome", e.target.value)}
            placeholder="Nome do donatário"
          />
        </div>
        <div className="space-y-2">
          <Label>CPF</Label>
          <Input 
            value={data.donatario_cpf || ""} 
            onChange={(e) => onChange("donatario_cpf", masks.cpf(e.target.value))}
            placeholder="000.000.000-00"
          />
        </div>
      </CardContent>
    </Card>
  );
}