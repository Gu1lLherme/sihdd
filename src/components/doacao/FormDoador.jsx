import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { masks } from "@/components/Masks";

export default function FormDoador({ data, onChange }) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-blue-500" />
          Dados do Doador
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome Completo</Label>
          <Input 
            value={data.doador_nome || ""} 
            onChange={(e) => onChange("doador_nome", e.target.value)}
            placeholder="Nome do doador"
          />
        </div>
        <div className="space-y-2">
          <Label>CPF</Label>
          <Input 
            value={data.doador_cpf || ""} 
            onChange={(e) => onChange("doador_cpf", masks.cpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </div>
      </CardContent>
    </Card>
  );
}