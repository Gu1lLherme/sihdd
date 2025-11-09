import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Bens({ formData, setFormData }) {
  const addBem = () => {
    setFormData(prev => ({
      ...prev,
      bens: [
        ...prev.bens,
        { tipo: "imovel", descricao: "", valor: 0, matricula: "", placa: "", banco: "", validado: false }
      ]
    }));
  };

  const removeBem = (index) => {
    setFormData(prev => ({
      ...prev,
      bens: prev.bens.filter((_, i) => i !== index)
    }));
  };

  const updateBem = (index, field, value) => {
    setFormData(prev => {
      const bens = [...prev.bens];
      bens[index] = { ...bens[index], [field]: value };
      return { ...prev, bens };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-green-600 pl-4">
          <h3 className="font-semibold text-lg text-green-700 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Bens do Espólio
          </h3>
          <p className="text-sm text-slate-600">Cadastre os bens que compõem o patrimônio</p>
        </div>
        <Button onClick={addBem} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Bem
        </Button>
      </div>

      {formData.bens.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-2 border-slate-300">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">Nenhum bem adicionado</p>
          <Button onClick={addBem} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Bem
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {formData.bens.map((bem, index) => (
            <Card key={index} className="p-4 border-slate-200">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Bem</Label>
                    <Select
                      value={bem.tipo}
                      onValueChange={(value) => updateBem(index, 'tipo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imovel">Imóvel</SelectItem>
                        <SelectItem value="veiculo">Veículo</SelectItem>
                        <SelectItem value="conta_bancaria">Conta Bancária</SelectItem>
                        <SelectItem value="investimento">Investimento</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={bem.valor}
                      onChange={(e) => updateBem(index, 'valor', parseFloat(e.target.value) || 0)}
                      placeholder="800000.00"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Descrição</Label>
                    <Input
                      value={bem.descricao}
                      onChange={(e) => updateBem(index, 'descricao', e.target.value)}
                      placeholder="Casa na Rua..."
                    />
                  </div>

                  {bem.tipo === 'imovel' && (
                    <div className="space-y-2">
                      <Label>Matrícula</Label>
                      <Input
                        value={bem.matricula}
                        onChange={(e) => updateBem(index, 'matricula', e.target.value)}
                        placeholder="00123"
                      />
                    </div>
                  )}

                  {bem.tipo === 'veiculo' && (
                    <div className="space-y-2">
                      <Label>Placa</Label>
                      <Input
                        value={bem.placa}
                        onChange={(e) => updateBem(index, 'placa', e.target.value)}
                        placeholder="ABC-1234"
                      />
                    </div>
                  )}

                  {bem.tipo === 'conta_bancaria' && (
                    <div className="space-y-2">
                      <Label>Banco</Label>
                      <Input
                        value={bem.banco}
                        onChange={(e) => updateBem(index, 'banco', e.target.value)}
                        placeholder="Banco do Brasil"
                      />
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBem(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {formData.bens.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-green-900">Valor Total dos Bens:</span>
            <span className="font-bold text-lg text-green-700">
              R$ {formData.bens.reduce((sum, b) => sum + b.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}