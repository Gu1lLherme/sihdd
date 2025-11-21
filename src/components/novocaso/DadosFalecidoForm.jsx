import React from 'react';
import { masks } from "@/components/Masks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function DadosFalecidoForm({ dadosCaso, setDadosCaso }) {
  const handleChange = (field, value) => {
    setDadosCaso(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Dados do Falecido</h2>
        <p className="text-slate-600">Informe os dados básicos do inventário</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome_falecido" className="text-slate-700 font-medium">
            Nome Completo do Falecido *
          </Label>
          <Input
            id="nome_falecido"
            value={dadosCaso.nome_falecido}
            onChange={(e) => handleChange('nome_falecido', e.target.value)}
            placeholder="João da Silva"
            className="border-slate-300 focus:border-[#1e3a5f]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf_falecido" className="text-slate-700 font-medium">
            CPF do Falecido
          </Label>
          <Input
            id="cpf_falecido"
            value={dadosCaso.cpf_falecido}
            onChange={(e) => handleChange('cpf_falecido', masks.cpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14}
            className="border-slate-300 focus:border-[#1e3a5f]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_obito" className="text-slate-700 font-medium">
            Data do Óbito *
          </Label>
          <Input
            id="data_obito"
            type="date"
            value={dadosCaso.data_obito}
            onChange={(e) => handleChange('data_obito', e.target.value)}
            className="border-slate-300 focus:border-[#1e3a5f]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="regime_bens" className="text-slate-700 font-medium">
            Regime de Bens
          </Label>
          <Select
            value={dadosCaso.regime_bens}
            onValueChange={(value) => handleChange('regime_bens', value)}
          >
            <SelectTrigger className="border-slate-300 focus:border-[#1e3a5f]">
              <SelectValue placeholder="Selecione o regime" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comunhao_parcial">Comunhão Parcial de Bens</SelectItem>
              <SelectItem value="comunhao_universal">Comunhão Universal de Bens</SelectItem>
              <SelectItem value="separacao_total">Separação Total de Bens</SelectItem>
              <SelectItem value="participacao_final">Participação Final nos Aquestos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="conjuge_nome" className="text-slate-700 font-medium">
            Nome do Cônjuge Sobrevivente
          </Label>
          <Input
            id="conjuge_nome"
            value={dadosCaso.conjuge_nome}
            onChange={(e) => handleChange('conjuge_nome', e.target.value)}
            placeholder="Maria Oliveira"
            className="border-slate-300 focus:border-[#1e3a5f]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conjuge_cpf" className="text-slate-700 font-medium">
            CPF do Cônjuge
          </Label>
          <Input
            id="conjuge_cpf"
            value={dadosCaso.conjuge_cpf}
            onChange={(e) => handleChange('conjuge_cpf', masks.cpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14}
            className="border-slate-300 focus:border-[#1e3a5f]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes" className="text-slate-700 font-medium">
          Observações
        </Label>
        <Textarea
          id="observacoes"
          value={dadosCaso.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Informações adicionais sobre o caso..."
          className="border-slate-300 focus:border-[#1e3a5f] min-h-24"
        />
      </div>
    </div>
  );
}