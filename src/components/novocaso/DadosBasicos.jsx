import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DadosBasicos({ formData, setFormData }) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-blue-900 pl-4 mb-6">
        <h3 className="font-semibold text-lg text-blue-900">Dados do Falecido</h3>
        <p className="text-sm text-slate-600">Informações sobre o de cujus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="falecido_nome">Nome Completo *</Label>
          <Input
            id="falecido_nome"
            value={formData.falecido_nome}
            onChange={(e) => handleChange('falecido_nome', e.target.value)}
            placeholder="João da Silva"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="falecido_cpf">CPF</Label>
          <Input
            id="falecido_cpf"
            value={formData.falecido_cpf}
            onChange={(e) => handleChange('falecido_cpf', e.target.value)}
            placeholder="000.000.000-00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_obito">Data do Óbito</Label>
          <Input
            id="data_obito"
            type="date"
            value={formData.data_obito}
            onChange={(e) => handleChange('data_obito', e.target.value)}
          />
        </div>
      </div>

      <div className="border-l-4 border-amber-500 pl-4 my-6">
        <h3 className="font-semibold text-lg text-slate-900">Cônjuge Sobrevivente</h3>
        <p className="text-sm text-slate-600">Viúva(o) meeira(o)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="conjuge_nome">Nome do Cônjuge</Label>
          <Input
            id="conjuge_nome"
            value={formData.conjuge_nome}
            onChange={(e) => handleChange('conjuge_nome', e.target.value)}
            placeholder="Maria Oliveira"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conjuge_cpf">CPF do Cônjuge</Label>
          <Input
            id="conjuge_cpf"
            value={formData.conjuge_cpf}
            onChange={(e) => handleChange('conjuge_cpf', e.target.value)}
            placeholder="000.000.000-00"
          />
        </div>
      </div>

      <div className="border-l-4 border-green-600 pl-4 my-6">
        <h3 className="font-semibold text-lg text-slate-900">Patrimônio</h3>
        <p className="text-sm text-slate-600">Valor total dos bens</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patrimonio_total">Patrimônio Total (R$) *</Label>
          <Input
            id="patrimonio_total"
            type="number"
            step="0.01"
            value={formData.patrimonio_total}
            onChange={(e) => handleChange('patrimonio_total', parseFloat(e.target.value) || 0)}
            placeholder="1000000.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aliquota">Alíquota ITCMD (%)</Label>
          <Input
            id="aliquota"
            type="number"
            step="0.01"
            value={formData.aliquota}
            onChange={(e) => handleChange('aliquota', parseFloat(e.target.value) || 4)}
            placeholder="4"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-900">
          <strong>ITCMD Estimado:</strong> R$ {((formData.patrimonio_total * formData.aliquota) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}