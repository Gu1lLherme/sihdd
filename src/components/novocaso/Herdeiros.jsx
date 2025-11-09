
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, AlertCircle, Users, CheckCircle2 } from "lucide-react";
import { validarCPF, formatarCPF, validarEmail, validarTelefone, formatarTelefone, validarPercentual, validarSomaPercentuais, validarObrigatorio } from "@/utils/validations";

export default function Herdeiros({ formData, setFormData }) {
  const [erros, setErros] = useState({});
  const [erroSomaPercentual, setErroSomaPercentual] = useState(null);

  const herdeiros = formData.herdeiros || [];

  useEffect(() => {
    // Validar soma de percentuais quando herdeiros mudam
    if (herdeiros.length > 0) {
      const percentuais = herdeiros.map(h => h.percentual || 0);
      const validacao = validarSomaPercentuais(percentuais);
      setErroSomaPercentual(validacao.valido ? null : validacao.erro);
    } else {
      setErroSomaPercentual(null);
    }
  }, [herdeiros]);

  const adicionarHerdeiro = () => {
    const novosHerdeiros = [...herdeiros, {
      nome: '',
      cpf: '',
      tipo: 'filho',
      percentual: 0,
      valor_parte: 0,
      email: '',
      telefone: ''
    }];
    setFormData(prev => ({ ...prev, herdeiros: novosHerdeiros }));
  };

  const removerHerdeiro = (index) => {
    const novosHerdeiros = herdeiros.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, herdeiros: novosHerdeiros }));
    
    // Limpar erros do herdeiro removido
    const novosErros = { ...erros };
    delete novosErros[`herdeiro_${index}`];
    setErros(novosErros);
  };

  const atualizarHerdeiro = (index, campo, valor) => {
    const novosHerdeiros = [...herdeiros];
    novosHerdeiros[index][campo] = valor;
    
    // Recalcular valor da parte baseado no percentual
    if (campo === 'percentual') {
      const percentual = parseFloat(valor) || 0;
      novosHerdeiros[index].valor_parte = (formData.valor_patrimonio * percentual) / 100;
    }
    
    setFormData(prev => ({ ...prev, herdeiros: novosHerdeiros }));
    
    // Limpar erro do campo
    if (erros[`herdeiro_${index}_${campo}`]) {
      const novosErros = { ...erros };
      delete novosErros[`herdeiro_${index}_${campo}`];
      setErros(novosErros);
    }
  };

  const validarCampoHerdeiro = (index, campo, valor) => {
    let validacao = { valido: true, erro: '' };
    
    switch(campo) {
      case 'nome':
        validacao = validarObrigatorio(valor, 'Nome');
        break;
      case 'cpf':
        validacao = validarCPF(valor);
        break;
      case 'email':
        validacao = validarEmail(valor);
        break;
      case 'telefone':
        validacao = validarTelefone(valor);
        break;
      case 'percentual':
        validacao = validarPercentual(valor);
        break;
    }
    
    if (!validacao.valido) {
      setErros(prev => ({ ...prev, [`herdeiro_${index}_${campo}`]: validacao.erro }));
    }
    
    return validacao.valido;
  };

  const handleBlur = (index, campo) => {
    const valor = herdeiros[index][campo];
    validarCampoHerdeiro(index, campo, valor);
  };

  const handleCPFChange = (index, value) => {
    const cpfFormatado = formatarCPF(value);
    atualizarHerdeiro(index, 'cpf', cpfFormatado);
  };

  const handleTelefoneChange = (index, value) => {
    const telefoneFormatado = formatarTelefone(value);
    atualizarHerdeiro(index, 'telefone', telefoneFormatado);
  };

  const somaPercentuais = herdeiros.reduce((sum, h) => sum + (parseFloat(h.percentual) || 0), 0);
  const somaCorreta = Math.abs(somaPercentuais - 100) < 0.01;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-blue-900 pl-4">
          <h3 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Herdeiros
          </h3>
          <p className="text-sm text-slate-600">Cadastre todos os herdeiros do inventário</p>
        </div>
        <Button
          type="button"
          onClick={adicionarHerdeiro}
          className="bg-blue-900 hover:bg-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Herdeiro
        </Button>
      </div>

      {herdeiros.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-300">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Nenhum herdeiro cadastrado
          </h3>
          <p className="text-slate-500 mb-4">
            Adicione os herdeiros para calcular a partilha
          </p>
          <Button onClick={adicionarHerdeiro} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Herdeiro
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {herdeiros.map((herdeiro, index) => (
            <Card key={index} className="p-6 border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold text-slate-900">Herdeiro {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removerHerdeiro(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo <span className="text-red-500">*</span></Label>
                  <Input
                    value={herdeiro.nome}
                    onChange={(e) => atualizarHerdeiro(index, 'nome', e.target.value)}
                    onBlur={() => handleBlur(index, 'nome')}
                    placeholder="Nome do herdeiro"
                    className={erros[`herdeiro_${index}_nome`] ? 'border-red-500' : ''}
                  />
                  {erros[`herdeiro_${index}_nome`] && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {erros[`herdeiro_${index}_nome`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input
                    value={herdeiro.cpf}
                    onChange={(e) => handleCPFChange(index, e.target.value)}
                    onBlur={() => handleBlur(index, 'cpf')}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={erros[`herdeiro_${index}_cpf`] ? 'border-red-500' : ''}
                  />
                  {erros[`herdeiro_${index}_cpf`] && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {erros[`herdeiro_${index}_cpf`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Parentesco</Label>
                  <Select
                    value={herdeiro.tipo}
                    onValueChange={(value) => atualizarHerdeiro(index, 'tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conjuge">Cônjuge</SelectItem>
                      <SelectItem value="filho">Filho(a)</SelectItem>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="irmao">Irmão(ã)</SelectItem>
                      <SelectItem value="neto">Neto(a)</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Percentual da Partilha (%) <span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={herdeiro.percentual}
                    onChange={(e) => atualizarHerdeiro(index, 'percentual', parseFloat(e.target.value) || 0)}
                    onBlur={() => handleBlur(index, 'percentual')}
                    placeholder="25.00"
                    className={erros[`herdeiro_${index}_percentual`] ? 'border-red-500' : ''}
                  />
                  {erros[`herdeiro_${index}_percentual`] && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {erros[`herdeiro_${index}_percentual`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={herdeiro.email}
                    onChange={(e) => atualizarHerdeiro(index, 'email', e.target.value)}
                    onBlur={() => handleBlur(index, 'email')}
                    placeholder="email@exemplo.com"
                    className={erros[`herdeiro_${index}_email`] ? 'border-red-500' : ''}
                  />
                  {erros[`herdeiro_${index}_email`] && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {erros[`herdeiro_${index}_email`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={herdeiro.telefone}
                    onChange={(e) => handleTelefoneChange(index, e.target.value)}
                    onBlur={() => handleBlur(index, 'telefone')}
                    placeholder="(79) 99999-9999"
                    maxLength={15}
                    className={erros[`herdeiro_${index}_telefone`] ? 'border-red-500' : ''}
                  />
                  {erros[`herdeiro_${index}_telefone`] && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {erros[`herdeiro_${index}_telefone`]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Valor da Parte:</strong>{' '}
                  <span className="text-slate-900 font-semibold">
                    R$ {(herdeiro.valor_parte || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </p>
              </div>
            </Card>
          ))}

          {/* Resumo da Partilha */}
          <Card className={`p-6 border-2 ${somaCorreta ? 'border-green-500 bg-green-50' : erroSomaPercentual ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  {somaCorreta ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  Total da Partilha
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Soma dos percentuais: <strong>{somaPercentuais.toFixed(2)}%</strong>
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${somaCorreta ? 'text-green-600' : 'text-red-600'}`}>
                  {somaPercentuais.toFixed(2)}%
                </p>
              </div>
            </div>
            {erroSomaPercentual && (
              <Alert variant="destructive" className="mt-4 border-red-300 bg-red-100">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-900">
                  {erroSomaPercentual}
                </AlertDescription>
              </Alert>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
