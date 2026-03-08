import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserMinus, UserPlus, AlertCircle } from "lucide-react";
import { masks } from "@/components/Masks";

export default function FormConjuges({ data, onChange }) {
  const doadorNomeVazio = !data.conjuge_doador_nome?.trim();
  const doadorCpfVazio = !data.conjuge_doador_cpf?.trim();
  const donatarioNomeVazio = !data.conjuge_donatario_nome?.trim();
  const donatarioCpfVazio = !data.conjuge_donatario_cpf?.trim();
  const regimeVazio = !data.regime_bens;

  const temCamposVazios = doadorNomeVazio || doadorCpfVazio || donatarioNomeVazio || donatarioCpfVazio || regimeVazio;

  return (
    <div className="space-y-6">
      {temCamposVazios && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700">Preencha todos os campos obrigatórios (<span className="text-red-500 font-bold">*</span>) para avançar à próxima etapa.</p>
        </div>
      )}

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
              <Label>Nome Completo <span className="text-red-500">*</span></Label>
              <Input 
                value={data.conjuge_doador_nome || ""} 
                onChange={(e) => onChange("conjuge_doador_nome", e.target.value)}
                placeholder="Nome do cônjuge"
                className={doadorNomeVazio ? "border-red-300 focus:border-red-500" : ""}
              />
              {doadorNomeVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label>CPF <span className="text-red-500">*</span></Label>
              <Input 
                value={data.conjuge_doador_cpf || ""} 
                onChange={(e) => onChange("conjuge_doador_cpf", masks.cpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className={doadorCpfVazio ? "border-red-300 focus:border-red-500" : ""}
              />
              {doadorCpfVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
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
              <Label>Nome Completo <span className="text-red-500">*</span></Label>
              <Input 
                value={data.conjuge_donatario_nome || ""} 
                onChange={(e) => onChange("conjuge_donatario_nome", e.target.value)}
                placeholder="Nome do cônjuge"
                className={donatarioNomeVazio ? "border-red-300 focus:border-red-500" : ""}
              />
              {donatarioNomeVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
            </div>
            <div className="space-y-2">
              <Label>CPF <span className="text-red-500">*</span></Label>
              <Input 
                value={data.conjuge_donatario_cpf || ""} 
                onChange={(e) => onChange("conjuge_donatario_cpf", masks.cpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className={donatarioCpfVazio ? "border-red-300 focus:border-red-500" : ""}
              />
              {donatarioCpfVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regime de Bens */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>Regime de Bens <span className="text-red-500">*</span></Label>
            <Select
              value={data.regime_bens || undefined}
              onValueChange={(val) => onChange("regime_bens", val)}
            >
              <SelectTrigger className={regimeVazio ? "border-red-300 focus:border-red-500" : ""}>
                <SelectValue placeholder="Selecione o regime de bens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uniao_estavel">União Estável</SelectItem>
                <SelectItem value="comunhao_universal">Comunhão Universal de Bens</SelectItem>
                <SelectItem value="comunhao_parcial">Comunhão Parcial de Bens</SelectItem>
                <SelectItem value="separacao_total">Separação Total de Bens</SelectItem>
                <SelectItem value="participacao_final">Participação Final nos Aquestos</SelectItem>
              </SelectContent>
            </Select>
            {regimeVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}