import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Upload, Calculator } from "lucide-react";
import { masks } from "@/components/Masks";

export default function DadosFinanceiros({ data, onChange }) {
  
  const handleCalculateTax = () => {
    if (!data.valor_excesso_meacao) return;
    // Simulação de cálculo: 4% sobre o excesso
    const val = masks.currencyToNumber(data.valor_excesso_meacao);
    const tax = val * 0.04;
    onChange("valor_tributo", tax);
  };

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scale className="w-5 h-5 text-purple-500" />
          Dados do Divórcio e Tributação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>Regime de Bens</Label>
                <Select 
                    value={data.regime_bens} 
                    onValueChange={(val) => onChange("regime_bens", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o regime" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="uniao_estavel">União Estável</SelectItem>
                        <SelectItem value="comunhao_universal">Comunhão Universal</SelectItem>
                        <SelectItem value="comunhao_parcial">Comunhão Parcial</SelectItem>
                        <SelectItem value="separacao_total">Separação Total</SelectItem>
                        <SelectItem value="participacao_final">Participação Final de Aquestos</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Documento do Regime</Label>
                <Button variant="outline" className="w-full" onClick={() => alert("Upload Simulado!")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Anexar Pacto/Certidão
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
             <div className="space-y-2">
                <Label>Valor Excesso de Meação (R$)</Label>
                <Input 
                    value={data.valor_excesso_meacao || ""}
                    onChange={(e) => onChange("valor_excesso_meacao", masks.currency(e.target.value))}
                    placeholder="0,00"
                />
            </div>
             <div className="space-y-2">
                <Label>Valor do Tributo (ITCMD)</Label>
                <Input 
                    value={data.valor_tributo ? masks.currency(Math.round(data.valor_tributo * 100)) : ""}
                    readOnly
                    className="bg-slate-100 font-bold text-purple-700"
                    placeholder="0,00"
                />
            </div>
            <Button onClick={handleCalculateTax} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Calculator className="w-4 h-4 mr-2" />
                Calcular Tributo
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}