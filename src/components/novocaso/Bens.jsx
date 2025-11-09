
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Home, Car, Building2, AlertCircle } from "lucide-react";
import { validarValor, validarObrigatorio } from "../../utils/validations";

const tipoIcons = {
  imovel: Home,
  veiculo: Car,
  conta_bancaria: Building2,
  investimento: Building2,
  empresa: Building2,
  outros: Building2,
};

export default function Bens({ formData, setFormData }) {
  const [erros, setErros] = useState({});
  const bens = formData.bens || [];

  const adicionarBem = () => {
    const novosBens = [...bens, {
      tipo: 'imovel',
      descricao: '',
      valor: 0,
      identificacao: '',
      observacoes: ''
    }];
    setFormData(prev => ({ ...prev, bens: novosBens }));
  };

  const removerBem = (index) => {
    const novosBens = bens.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, bens: novosBens }));
    
    // Limpar erros do bem removido
    const novosErros = { ...erros };
    delete novosErros[`bem_${index}`];
    setErros(novosErros);
  };

  const atualizarBem = (index, campo, valor) => {
    const novosBens = [...bens];
    novosBens[index][campo] = valor;
    setFormData(prev => ({ ...prev, bens: novosBens }));
    
    // Limpar erro do campo
    if (erros[`bem_${index}_${campo}`]) {
      const novosErros = { ...erros };
      delete novosErros[`bem_${index}_${campo}`];
      setErros(novosErros);
    }
  };

  const validarCampoBem = (index, campo, valor) => {
    let validacao = { valido: true, erro: '' };
    
    switch(campo) {
      case 'descricao':
        validacao = validarObrigatorio(valor, 'Descrição');
        break;
      case 'valor':
        validacao = validarValor(valor, { obrigatorio: true, positivo: true, minimo: 0 });
        break;
    }
    
    if (!validacao.valido) {
      setErros(prev => ({ ...prev, [`bem_${index}_${campo}`]: validacao.erro }));
    }
    
    return validacao.valido;
  };

  const handleBlur = (index, campo) => {
    const valor = bens[index][campo];
    validarCampoBem(index, campo, valor);
  };

  const valorTotal = bens.reduce((sum, bem) => sum + (parseFloat(bem.valor) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-blue-900 pl-4">
          <h3 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Bens do Espólio
          </h3>
          <p className="text-sm text-slate-600">Cadastre todos os bens que compõem o patrimônio</p>
        </div>
        <Button
          type="button"
          onClick={adicionarBem}
          className="bg-blue-900 hover:bg-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Bem
        </Button>
      </div>

      {bens.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-300">
          <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Nenhum bem cadastrado
          </h3>
          <p className="text-slate-500 mb-4">
            Adicione os bens para calcular o patrimônio total
          </p>
          <Button onClick={adicionarBem} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Bem
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {bens.map((bem, index) => {
            const Icon = tipoIcons[bem.tipo] || Home;
            
            return (
              <Card key={index} className="p-6 border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-900" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Bem {index + 1}</h4>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removerBem(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Bem</Label>
                    <Select
                      value={bem.tipo}
                      onValueChange={(value) => atualizarBem(index, 'tipo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imovel">Imóvel</SelectItem>
                        <SelectItem value="veiculo">Veículo</SelectItem>
                        <SelectItem value="conta_bancaria">Conta Bancária</SelectItem>
                        <SelectItem value="investimento">Investimento</SelectItem>
                        <SelectItem value="empresa">Empresa/Participação</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Valor (R$) <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={bem.valor}
                      onChange={(e) => atualizarBem(index, 'valor', parseFloat(e.target.value) || 0)}
                      onBlur={() => handleBlur(index, 'valor')}
                      placeholder="100000.00"
                      className={erros[`bem_${index}_valor`] ? 'border-red-500' : ''}
                    />
                    {erros[`bem_${index}_valor`] && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {erros[`bem_${index}_valor`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Descrição <span className="text-red-500">*</span></Label>
                    <Input
                      value={bem.descricao}
                      onChange={(e) => atualizarBem(index, 'descricao', e.target.value)}
                      onBlur={() => handleBlur(index, 'descricao')}
                      placeholder="Ex: Casa na Rua Principal, 123"
                      className={erros[`bem_${index}_descricao`] ? 'border-red-500' : ''}
                    />
                    {erros[`bem_${index}_descricao`] && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {erros[`bem_${index}_descricao`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Identificação</Label>
                    <Input
                      value={bem.identificacao}
                      onChange={(e) => atualizarBem(index, 'identificacao', e.target.value)}
                      placeholder="Matrícula, Placa, Nº da Conta, etc"
                    />
                    <p className="text-xs text-slate-500">
                      Matrícula do imóvel, placa do veículo, número da conta, etc.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      value={bem.observacoes}
                      onChange={(e) => atualizarBem(index, 'observacoes', e.target.value)}
                      placeholder="Informações adicionais sobre o bem"
                      rows={2}
                    />
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Resumo Total */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg text-blue-900">Patrimônio Total</h4>
                <p className="text-sm text-slate-600 mt-1">
                  {bens.length} {bens.length === 1 ? 'bem cadastrado' : 'bens cadastrados'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-900">
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
