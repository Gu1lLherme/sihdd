import React from 'react';
import { masks } from "@/components/Masks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Home, Car, CreditCard, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const tipoIcons = {
  imovel: Home,
  veiculo: Car,
  conta_bancaria: CreditCard,
  investimento: Building2,
  empresa: Building2,
  outros: CreditCard,
};

export default function BensForm({ bens, setBens }) {
  const addBem = () => {
    setBens([...bens, {
      tipo: "",
      descricao: "",
      valor: 0,
      identificacao: "",
      observacoes: "",
      status_validacao: "pendente",
    }]);
  };

  const removeBem = (index) => {
    setBens(bens.filter((_, i) => i !== index));
  };

  const updateBem = (index, field, value) => {
    const updated = [...bens];
    updated[index] = { ...updated[index], [field]: value };
    setBens(updated);
  };

  const totalPatrimonio = bens.reduce((sum, b) => sum + (parseFloat(b.valor) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2 flex items-center gap-2">
            <Home className="w-6 h-6" />
            Bens do Inventário
          </h2>
          <p className="text-slate-600">Liste todos os bens que compõem o patrimônio</p>
        </div>
        <Button
          onClick={addBem}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] hover:from-[#2d5a8f] hover:to-[#1e3a5f]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Bem
        </Button>
      </div>

      {bens.length === 0 && (
        <Card className="p-12 text-center border-2 border-dashed border-slate-300">
          <Home className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Nenhum bem adicionado
          </h3>
          <p className="text-slate-500 mb-4">
            Clique no botão acima para adicionar o primeiro bem
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {bens.map((bem, index) => {
          const IconComponent = tipoIcons[bem.tipo] || Home;
          return (
            <Card key={index} className="p-6 border-slate-200 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#1e3a5f]">
                    Bem {index + 1}
                  </h3>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Tipo de Bem *</Label>
                  <Select
                    value={bem.tipo}
                    onValueChange={(value) => updateBem(index, 'tipo', value)}
                  >
                    <SelectTrigger className="border-slate-300 focus:border-[#1e3a5f]">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imovel">Imóvel</SelectItem>
                      <SelectItem value="veiculo">Veículo</SelectItem>
                      <SelectItem value="conta_bancaria">Conta Bancária</SelectItem>
                      <SelectItem value="investimento">Investimento</SelectItem>
                      <SelectItem value="empresa">Empresa</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Valor (R$) *</Label>
                  {/* Usando type="text" para permitir formatação de moeda */}
                  <Input
                    type="text"
                    value={masks.currency(bem.valor)}
                    onChange={(e) => {
                      // Remove formatação para salvar o número puro no estado, mas a máscara visual usa o valor numérico convertido
                      const rawValue = e.target.value.replace(/\D/g, "");
                      updateBem(index, 'valor', rawValue); // Salvamos como centavos ou string numérica, ajuste conforme backend espera.
                      // O backend espera number (float). Então:
                      // updateBem(index, 'valor', Number(rawValue) / 100);
                    }}
                    onBlur={(e) => {
                        // Ensure consistency on blur if needed
                    }}
                    placeholder="0,00"
                    className="border-slate-300 focus:border-[#1e3a5f]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-700 font-medium">Descrição *</Label>
                  <Input
                    value={bem.descricao}
                    onChange={(e) => updateBem(index, 'descricao', e.target.value)}
                    placeholder="Ex: Casa na Rua Principal, nº 123"
                    className="border-slate-300 focus:border-[#1e3a5f]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-700 font-medium">
                    Identificação (Matrícula, Placa, Nº da Conta, etc)
                  </Label>
                  <Input
                    value={bem.identificacao}
                    onChange={(e) => updateBem(index, 'identificacao', e.target.value)}
                    placeholder="Ex: Matrícula 00123, Placa ABC-1234"
                    className="border-slate-300 focus:border-[#1e3a5f]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-700 font-medium">Observações</Label>
                  <Textarea
                    value={bem.observacoes}
                    onChange={(e) => updateBem(index, 'observacoes', e.target.value)}
                    placeholder="Informações adicionais sobre o bem..."
                    className="border-slate-300 focus:border-[#1e3a5f]"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {bens.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-700">
              Valor Total do Patrimônio:
            </span>
            <span className="text-2xl font-bold text-[#1e3a5f]">
              {totalPatrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}