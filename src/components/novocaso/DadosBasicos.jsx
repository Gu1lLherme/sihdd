import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Select still needed for sexo field
import { masks } from "@/components/Masks";
import { validators, FieldError } from "@/components/validations";
import { Calendar, Clock, User, FileText, Briefcase, ScrollText, AlertCircle } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import OrgaoExpedidorSelect from "@/components/novocaso/OrgaoExpedidorSelect";
import AddressInput from "@/components/AddressInput";
import CpfUnicoValidator from "@/components/novocaso/CpfUnicoValidator";
import DateBeforeObitoValidator from "@/components/novocaso/DateBeforeObitoValidator";
import DateFutureValidator from "@/components/novocaso/DateFutureValidator";
import DateAfterObitoValidator from "@/components/novocaso/DateAfterObitoValidator";

// Nota: Dados do Cônjuge foram movidos para DadosConjuge.jsx (etapa separada)

const TODAY = new Date().toISOString().split('T')[0];
const MIN_DATE = "1600-01-01";

export default function DadosBasicos({ formData, setFormData }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nomeVazio = !formData.nome_falecido?.trim();
  const cpfVazio = !formData.cpf_falecido?.trim();
  const dataObitoVazia = !formData.data_obito;
  const temCamposObrigatoriosVazios = nomeVazio || cpfVazio || dataObitoVazia;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {temCamposObrigatoriosVazios && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700">Preencha todos os campos obrigatórios (<span className="text-red-500 font-bold">*</span>) para avançar à próxima etapa.</p>
        </div>
      )}
      
      {/* 1.1 DADOS DO FALECIDO */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b pb-2 border-slate-200">
          <User className="w-5 h-5 text-blue-900" />
          <h3 className="font-bold text-xl text-blue-900">Dados do Falecido</h3>
        </div>

        {/* Nome Completo */}
        <div className="space-y-2">
          <Label htmlFor="nome_falecido">Nome Completo <span className="text-red-500">*</span></Label>
          <Input id="nome_falecido"
          value={formData.nome_falecido || ''}
          onChange={(e) => handleChange('nome_falecido', masks.onlyLetters(e.target.value))}
          placeholder="Nome completo do falecido"
          className={`text-lg ${nomeVazio ? "border-red-300 focus:border-red-500" : ""}`} />
          {nomeVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
          <FieldError value={formData.nome_falecido} validator="nome" />
        </div>

        {/* Documentação */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cpf_falecido">CPF <span className="text-red-500">*</span></Label>
            <Input
              id="cpf_falecido"
              value={formData.cpf_falecido}
              onChange={(e) => handleChange('cpf_falecido', masks.cpf(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              className={cpfVazio || (!validators.cpf(formData.cpf_falecido).valid && formData.cpf_falecido) ? "border-red-300 focus:border-red-500" : ""} />
            {cpfVazio && <p className="text-xs text-red-500">Campo obrigatório</p>}
            <FieldError value={formData.cpf_falecido} validator="cpf" />
            <CpfUnicoValidator cpf={formData.cpf_falecido} formData={formData} ownerLabel="falecido" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rg"
              value={formData.rg || ''}
              onChange={(e) => handleChange('rg', masks.rg(e.target.value))}
              placeholder="00.000.000-0"
              maxLength={12} />
            <FieldError value={formData.rg} validator="rg" />
          </div>
          <OrgaoExpedidorSelect
            value={formData.orgao_expedidor || ''}
            onChange={(val) => handleChange('orgao_expedidor', val)}
          />
          <div className="space-y-2">
            <Label htmlFor="data_expedicao">Data Expedição</Label>
            <Input
              id="data_expedicao"
              type="date"
              min={MIN_DATE}
              max={TODAY}
              value={formData.data_expedicao || ''}
              onChange={(e) => handleChange('data_expedicao', e.target.value)} />
            <FieldError value={formData.data_expedicao} validator="datePastOnly" />

          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Select
              value={formData.sexo || ""}
              onValueChange={(val) => handleChange('sexo', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nacionalidade">Nacionalidade</Label>
            <Input
              id="nacionalidade"
              value={formData.nacionalidade || 'Brasileira'}
              onChange={(e) => handleChange('nacionalidade', masks.onlyLetters(e.target.value))}
              placeholder="Ex: Brasileira" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              type="date"
              min={MIN_DATE}
              max={formData.data_obito || TODAY}
              value={formData.data_nascimento || ''}
              onChange={(e) => handleChange('data_nascimento', e.target.value)} />
            <FieldError value={formData.data_nascimento} validator="datePastOnly" />
            <DateBeforeObitoValidator date={formData.data_nascimento} dataObito={formData.data_obito} label="Data de nascimento" />
          </div>
        </div>

        {/* Profissão e Filiação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profissao">Profissão</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="profissao"
                className="pl-10"
                value={formData.profissao || ''}
                onChange={(e) => handleChange('profissao', masks.onlyLetters(e.target.value))}
                placeholder="Profissão do falecido" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filiacao_pai">Nome do Pai</Label>
            <Input
              id="filiacao_pai"
              value={formData.filiacao_pai || ''}
              onChange={(e) => handleChange('filiacao_pai', masks.onlyLetters(e.target.value))}
              placeholder="Nome completo do pai" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filiacao_mae">Nome da Mãe</Label>
            <Input
              id="filiacao_mae"
              value={formData.filiacao_mae || ''}
              onChange={(e) => handleChange('filiacao_mae', masks.onlyLetters(e.target.value))}
              placeholder="Nome completo da mãe" />
          </div>
        </div>

        {/* Informações do Óbito */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_obito">Data do Óbito <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="data_obito"
                type="date"
                min={MIN_DATE}
                max={TODAY}
                className={`pl-10 ${dataObitoVazia ? "border-red-300 focus:border-red-500" : ""}`}
                value={formData.data_obito || ''}
                onChange={(e) => handleChange('data_obito', e.target.value)} />
            </div>
            {dataObitoVazia && <p className="text-xs text-red-500">Campo obrigatório</p>}
            <DateFutureValidator date={formData.data_obito} label="Data do óbito" />
            <p className="text-[11px] text-slate-500 italic">
              ⚖️ A legislação do ITCMD aplicada (alíquota e UFP) usa esta data como referência.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="horario_obito">Horário do Óbito</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="horario_obito"
                type="time"
                className="pl-10"
                value={formData.horario_obito || ''}
                onChange={(e) => handleChange('horario_obito', e.target.value)} />

            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="local_obito">Local do Óbito</Label>
            <Input
              id="local_obito"
              value={formData.local_obito || ''}
              onChange={(e) => handleChange('local_obito', e.target.value)}
              placeholder="Cidade/Estado ou Hospital" />

          </div>
        </div>

        {/* Localidade */}
        <AddressInput
          prefix="endereco"
          values={{
            cep: formData.cep,
            logradouro: formData.endereco_logradouro,
            numero: formData.endereco_numero,
            bairro: formData.endereco_bairro,
            cidade: formData.endereco_cidade,
            uf: formData.endereco_uf,
          }}
          onChange={(field, value) => {
            const fieldMap = { cep: 'cep', logradouro: 'endereco_logradouro', numero: 'endereco_numero', bairro: 'endereco_bairro', cidade: 'endereco_cidade', uf: 'endereco_uf' };
            handleChange(fieldMap[field], value);
          }}
          onAddressFound={({ logradouro, bairro, cidade, uf }) => {
            setFormData(prev => ({
              ...prev,
              endereco_logradouro: logradouro,
              endereco_bairro: bairro,
              endereco_cidade: cidade,
              endereco_uf: uf,
            }));
          }}
        />

        {/* Certidão de Óbito */}
        <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-slate-600" />
            <Label className="font-semibold text-slate-700">Certidão de Óbito</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certidao_obito_numero">Nº Matrícula (32 dígitos)</Label>
              <Input
                id="certidao_obito_numero"
                value={formData.certidao_obito_numero || ''}
                onChange={(e) => handleChange('certidao_obito_numero', masks.matriculaCertidao(e.target.value))}
                placeholder="00000000000000 0 00000 000 0000000 00"
                maxLength={37} />
              <FieldError value={formData.certidao_obito_numero} validator="matriculaCertidaoObito" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certidao_obito_cartorio">Cartório Emissor</Label>
              <Input
                id="certidao_obito_cartorio"
                value={formData.certidao_obito_cartorio || ''}
                onChange={(e) => handleChange('certidao_obito_cartorio', e.target.value)}
                placeholder="Nome do cartório" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certidao_obito_data">Data de Emissão</Label>
              <Input
                id="certidao_obito_data"
                type="date"
                min={formData.data_obito || MIN_DATE}
                max={TODAY}
                value={formData.certidao_obito_data || ''}
                onChange={(e) => handleChange('certidao_obito_data', e.target.value)} />
              <FieldError value={formData.certidao_obito_data} validator="datePastOnly" />
              <DateAfterObitoValidator date={formData.certidao_obito_data} dataObito={formData.data_obito} label="Data de emissão da certidão" />
            </div>
          </div>
          <div className="pt-2">
            <Label className="text-slate-600 mb-2 block">Anexar Certidão de Óbito (apenas 1 documento)</Label>
            <FileUpload
              value={formData.certidao_obito_url || ""}
              onChange={(url) => handleChange("certidao_obito_url", url)}
              label="Anexar Certidão de Óbito"
              accept=".pdf,.jpg,.jpeg,.png"
              maxFiles={1}
            />
          </div>
        </div>

        {/* Testamento */}
        <div className="space-y-4 p-4 bg-amber-50/50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="existencia_testamento"
              checked={formData.existencia_testamento === true}
              onChange={(e) => handleChange('existencia_testamento', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded"
            />
            <div className="flex-1">
              <Label htmlFor="existencia_testamento" className="font-semibold text-amber-900">
                Existe testamento registrado?
              </Label>
              <p className="text-xs text-amber-700 mt-1">Marque se há testamento público, cerrado ou particular.</p>
            </div>
          </div>
          {formData.existencia_testamento && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Testamento</Label>
                  <Select
                    value={formData.testamento_tipo || ""}
                    onValueChange={(val) => handleChange('testamento_tipo', val)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publico">Público</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                      <SelectItem value="particular">Particular</SelectItem>
                      <SelectItem value="nuncupativo">Nuncupativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cartório de Registro</Label>
                  <Input
                    value={formData.testamento_cartorio || ''}
                    onChange={(e) => handleChange('testamento_cartorio', e.target.value)}
                    placeholder="Cartório que registrou" />
                </div>
                <div className="space-y-2">
                  <Label>Data de Lavratura</Label>
                  <Input
                    type="date"
                    min={MIN_DATE}
                    max={TODAY}
                    value={formData.testamento_data || ''}
                    onChange={(e) => handleChange('testamento_data', e.target.value)} />
                  <FieldError value={formData.testamento_data} validator="datePastOnly" />
                </div>
              </div>
              <div>
                <Label className="text-amber-800 mb-2 block">Anexar Testamento (PDF/Imagem)</Label>
                <FileUpload
                  value={formData.testamento_url || ""}
                  onChange={(url) => handleChange("testamento_url", url)}
                  label="Anexar Testamento"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          )}
        </div>


      </div>

    </div>
  );

}