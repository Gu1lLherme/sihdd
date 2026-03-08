import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Calculator } from "lucide-react";
import { masks } from "@/components/Masks";
import FileUpload from "@/components/FileUpload";

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
                <Input 
                    value={
                      data.regime_bens === 'uniao_estavel' ? 'União Estável' :
                      data.regime_bens === 'comunhao_universal' ? 'Comunhão Universal' :
                      data.regime_bens === 'comunhao_parcial' ? 'Comunhão Parcial' :
                      data.regime_bens === 'separacao_total' ? 'Separação Total' :
                      data.regime_bens === 'participacao_final' ? 'Participação Final' :
                      'Não informado'
                    }
                    readOnly
                    className="bg-slate-100"
                />
                <p className="text-xs text-slate-500">Definido na etapa anterior</p>
            </div>
            <div className="space-y-2">
                <Label>Documento do Regime</Label>
                <FileUpload
                  value={data.documento_regime_url || ""}
                  onChange={(url) => onChange("documento_regime_url", url)}
                  label="Anexar Pacto/Certidão"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
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