import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserMinus, UserPlus } from "lucide-react";
import { masks } from "@/components/Masks";

export default function FormConjuges({ data, onChange }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cônjuge Doador */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserMinus className="w-5 h-5 text-blue-500" />
            Cônjuge Doador (Cedeu)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input 
              value={data.conjuge_doador_nome || ""} 
              onChange={(e) => onChange("conjuge_doador_nome", e.target.value)}
              placeholder="Nome do cônjuge"
            />
          </div>
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input 
              value={data.conjuge_doador_cpf || ""} 
              onChange={(e) => onChange("conjuge_doador_cpf", masks.cpf(e.target.value))}
              placeholder="000.000.000-00"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cônjuge Donatário */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="w-5 h-5 text-green-500" />
            Cônjuge Donatário (Recebeu)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input 
              value={data.conjuge_donatario_nome || ""} 
              onChange={(e) => onChange("conjuge_donatario_nome", e.target.value)}
              placeholder="Nome do cônjuge"
            />
          </div>
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input 
              value={data.conjuge_donatario_cpf || ""} 
              onChange={(e) => onChange("conjuge_donatario_cpf", masks.cpf(e.target.value))}
              placeholder="000.000.000-00"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}