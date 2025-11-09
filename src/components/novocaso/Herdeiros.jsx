import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Herdeiros({ formData, setFormData }) {
  const addHerdeiro = () => {
    setFormData(prev => ({
      ...prev,
      herdeiros: [
        ...prev.herdeiros,
        { nome: "", cpf: "", tipo: "filho", percentual: 0, valor_parte: 0, itcmd_devido: 0 }
      ]
    }));
  };

  const removeHerdeiro = (index) => {
    setFormData(prev => ({
      ...prev,
      herdeiros: prev.herdeiros.filter((_, i) => i !== index)
    }));
  };

  const updateHerdeiro = (index, field, value) => {
    setFormData(prev => {
      const herdeiros = [...prev.herdeiros];
      herdeiros[index] = { ...herdeiros[index], [field]: value };
      
      if (field === 'percentual') {
        herdeiros[index].valor_parte = (prev.patrimonio_total * value) / 100;
        herdeiros[index].itcmd_devido = (herdeiros[index].valor_parte * prev.aliquota) / 100;
      }
      
      return { ...prev, herdeiros };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-blue-900 pl-4">
          <h3 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista de Herdeiros
          </h3>
          <p className="text-sm text-slate-600">Adicione os beneficiários da herança</p>
        </div>
        <Button onClick={addHerdeiro} className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Herdeiro
        </Button>
      </div>

      {formData.herdeiros.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-2 border-slate-300">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">Nenhum herdeiro adicionado</p>
          <Button onClick={addHerdeiro} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Herdeiro
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {formData.herdeiros.map((herdeiro, index) => (
            <Card key={index} className="p-4 border-slate-200">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      value={herdeiro.nome}
                      onChange={(e) => updateHerdeiro(index, 'nome', e.target.value)}
                      placeholder="Pedro da Silva"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={herdeiro.cpf}
                      onChange={(e) => updateHerdeiro(index, 'cpf', e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={herdeiro.tipo}
                      onValueChange={(value) => updateHerdeiro(index, 'tipo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viuva_meeira">Viúva Meeira</SelectItem>
                        <SelectItem value="filho">Filho</SelectItem>
                        <SelectItem value="filha">Filha</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Percentual (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={herdeiro.percentual}
                      onChange={(e) => updateHerdeiro(index, 'percentual', parseFloat(e.target.value) || 0)}
                      placeholder="25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor da Parte (R$)</Label>
                    <Input
                      type="number"
                      value={herdeiro.valor_parte.toFixed(2)}
                      disabled
                      className="bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ITCMD Devido (R$)</Label>
                    <Input
                      type="number"
                      value={herdeiro.itcmd_devido.toFixed(2)}
                      disabled
                      className="bg-slate-50"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHerdeiro(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {formData.herdeiros.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-900">Total de Percentuais:</span>
            <span className={`font-bold text-lg ${
              formData.herdeiros.reduce((sum, h) => sum + h.percentual, 0) === 100
                ? "text-green-600"
                : "text-red-600"
            }`}>
              {formData.herdeiros.reduce((sum, h) => sum + h.percentual, 0).toFixed(2)}%
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}