
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { validarCPF, formatarCPF, validarData, validarValor, validarObrigatorio } from "../../utils/validations";

export default function DadosBasicos({ formData, setFormData }) {
  const [erros, setErros] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo ao digitar
    if (erros[field]) {
      setErros(prev => ({ ...prev, [field]: null }));
    }
  };

  const validarCampo = (campo, valor) => {
    let validacao = { valido: true, erro: '' };
    
    switch(campo) {
      case 'nome_falecido':
        validacao = validarObrigatorio(valor, 'Nome do falecido');
        break;
      case 'cpf_falecido':
        validacao = validarCPF(valor);
        break;
      case 'conjuge_cpf':
        validacao = validarCPF(valor);
        break;
      case 'data_obito':
        validacao = validarData(valor, { naoFutura: true });
        break;
      case 'valor_patrimonio':
        validacao = validarValor(valor, { obrigatorio: true, positivo: true, minimo: 0 });
        break;
      case 'aliquota':
        validacao = validarValor(valor, { minimo: 0, maximo: 100 });
        break;
    }
    
    if (!validacao.valido) {
      setErros(prev => ({ ...prev, [campo]: validacao.erro }));
    }
    
    return validacao.valido;
  };

  const handleBlur = (campo) => {
    validarCampo(campo, formData[campo]);
  };

  const handleCPFChange = (field, value) => {
    const cpfFormatado = formatarCPF(value);
    handleChange(field, cpfFormatado);
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-blue-900 pl-4 mb-6">
        <h3 className="font-semibold text-lg text-blue-900">Dados do Falecido</h3>
        <p className="text-sm text-slate-600">Informações sobre o de cujus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome_falecido">
            Nome Completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nome_falecido"
            value={formData.nome_falecido}
            onChange={(e) => handleChange('nome_falecido', e.target.value)}
            onBlur={() => handleBlur('nome_falecido')}
            placeholder="João da Silva"
            className={erros.nome_falecido ? 'border-red-500' : ''}
          />
          {erros.nome_falecido && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {erros.nome_falecido}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf_falecido">CPF</Label>
          <Input
            id="cpf_falecido"
            value={formData.cpf_falecido}
            onChange={(e) => handleCPFChange('cpf_falecido', e.target.value)}
            onBlur={() => handleBlur('cpf_falecido')}
            placeholder="000.000.000-00"
            maxLength={14}
            className={erros.cpf_falecido ? 'border-red-500' : ''}
          />
          {erros.cpf_falecido && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {erros.cpf_falecido}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_obito">Data do Óbito</Label>
          <Input
            id="data_obito"
            type="date"
            value={formData.data_obito}
            onChange={(e) => handleChange('data_obito', e.target.value)}
            onBlur={() => handleBlur('data_obito')}
            max={new Date().toISOString().split('T')[0]}
            className={erros.data_obito ? 'border-red-500' : ''}
          />
          {erros.data_obito && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {erros.data_obito}
            </p>
          )}
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
            onChange={(e) => handleCPFChange('conjuge_cpf', e.target.value)}
            onBlur={() => handleBlur('conjuge_cpf')}
            placeholder="000.000.000-00"
            maxLength={14}
            className={erros.conjuge_cpf ? 'border-red-500' : ''}
          />
          {erros.conjuge_cpf && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {erros.conjuge_cpf}
            </p>
          )}
        </div>
      </div>

      <div className="border-l-4 border-green-600 pl-4 my-6">
        <h3 className="font-semibold text-lg text-slate-900">Patrimônio</h3>
        <p className="text-sm text-slate-600">Valor total dos bens</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor_patrimonio">
            Patrimônio Total (R$) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="valor_patrimonio"
            type="number"
            step="0.01"
            min="0"
            value={formData.valor_patrimonio}
            onChange={(e) => handleChange('valor_patrimonio', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('valor_patrimonio')}
            placeholder="1000000.00"
            className={erros.valor_patrimonio ? 'border-red-500' : ''}
          />
          {erros.valor_patrimonio && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {erros.valor_patrimonio}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="aliquota">Alíquota ITCMD (%)</Label>
          <Input
            id="aliquota"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.aliquota}
            onChange={(e) => handleChange('aliquota', parseFloat(e.target.value) || 4)}
            onBlur={() => handleBlur('aliquota')}
            placeholder="4"
            className={erros.aliquota ? 'border-red-500' : ''}
          />
          {erros.aliquota && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {erros.aliquota}
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-900">
          <strong>ITCMD Estimado:</strong> R$ {((formData.valor_patrimonio * formData.aliquota) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {Object.keys(erros).length > 0 && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-900">
            Por favor, corrija os erros acima antes de prosseguir.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
