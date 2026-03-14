import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { masks } from "@/components/Masks";
import { validators, FieldError } from "@/components/validations";
import { Calendar, Clock, MapPin, User, FileText, Phone, Mail, Briefcase, Users2, ScrollText, AlertCircle } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import OrgaoExpedidorSelect from "@/components/novocaso/OrgaoExpedidorSelect";

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
              max="9999-12-31"
              value={formData.data_expedicao || ''}
              onChange={(e) => handleChange('data_expedicao', e.target.value)} />

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
              max="9999-12-31"
              value={formData.data_nascimento || ''}
              onChange={(e) => handleChange('data_nascimento', e.target.value)} />
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
                max="9999-12-31"
                className={`pl-10 ${dataObitoVazia ? "border-red-300 focus:border-red-500" : ""}`}
                value={formData.data_obito || ''}
                onChange={(e) => handleChange('data_obito', e.target.value)} />
            </div>
            {dataObitoVazia && <p className="text-xs text-red-500">Campo obrigatório</p>}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="endereco">Endereço Completo</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="endereco"
                className="pl-10"
                value={formData.endereco || ''}
                onChange={(e) => handleChange('endereco', e.target.value)}
                placeholder="Rua, Número, Bairro, Cidade - UF" />

            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={formData.cep || ''}
              onChange={(e) => handleChange('cep', masks.cep(e.target.value))}
              placeholder="00000-000"
              maxLength={9} />
            <FieldError value={formData.cep} validator="cep" />
          </div>
        </div>

        {/* Certidão de Óbito */}
        <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-slate-600" />
            <Label className="font-semibold text-slate-700">Certidão de Óbito</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certidao_obito_numero">Nº Matrícula</Label>
              <Input
                id="certidao_obito_numero"
                value={formData.certidao_obito_numero || ''}
                onChange={(e) => handleChange('certidao_obito_numero', e.target.value)}
                placeholder="Número da matrícula" />
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
                max="9999-12-31"
                value={formData.certidao_obito_data || ''}
                onChange={(e) => handleChange('certidao_obito_data', e.target.value)} />
            </div>
          </div>
          <div className="pt-2">
            <Label className="text-slate-600 mb-2 block">Anexar Certidão de Óbito (PDF/Imagem)</Label>
            <FileUpload
              value={formData.certidao_obito_url || ""}
              onChange={(url) => handleChange("certidao_obito_url", url)}
              label="Anexar Certidão de Óbito"
              accept=".pdf,.jpg,.jpeg,.png"
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
                    max="9999-12-31"
                    value={formData.testamento_data || ''}
                    onChange={(e) => handleChange('testamento_data', e.target.value)} />
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

        {/* Regime de Bens e Data do Casamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="regime_bens">Regime de Bens do Casamento</Label>
            <Select
              value={formData.regime_bens || ""}
              onValueChange={(val) => handleChange('regime_bens', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o regime de bens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uniao_estavel">União Estável</SelectItem>
                <SelectItem value="comunhao_universal">Comunhão Universal de Bens</SelectItem>
                <SelectItem value="comunhao_parcial">Comunhão Parcial de Bens</SelectItem>
                <SelectItem value="separacao_total">Separação Total de Bens</SelectItem>
                <SelectItem value="separacao_obrigatoria">Separação Obrigatória</SelectItem>
                <SelectItem value="participacao_final">Participação Final nos Aquestos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_casamento">Data do Casamento</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="data_casamento"
                type="date"
                max="9999-12-31"
                className="pl-10"
                value={formData.data_casamento || ''}
                onChange={(e) => handleChange('data_casamento', e.target.value)} />
            </div>
            <p className="text-xs text-slate-500">Importante para classificar bens em comuns ou particulares</p>
          </div>
        </div>

        {/* Regra dos 25% - Cônjuge é ascendente dos herdeiros */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="conjuge_e_ascendente_herdeiros"
              checked={formData.conjuge_e_ascendente_herdeiros !== false}
              onChange={(e) => handleChange('conjuge_e_ascendente_herdeiros', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <Label htmlFor="conjuge_e_ascendente_herdeiros" className="font-semibold text-amber-900">
                O cônjuge sobrevivente é pai/mãe de todos os herdeiros?
              </Label>
              <p className="text-xs text-amber-700 mt-1">
                Se marcado, aplica-se a "Regra dos 25%": o cônjuge não pode receber menos que 1/4 da herança quando concorre com seus próprios filhos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1.2 DADOS DO CÔNJUGE SOBREVIVENTE */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 border-b pb-2 border-slate-200">
          <User className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-xl text-slate-900">Dados do Cônjuge Sobrevivente</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conjuge_nome">Nome Completo</Label>
            <Input
              id="conjuge_nome"
              value={formData.conjuge_nome || ''}
              onChange={(e) => handleChange('conjuge_nome', masks.onlyLetters(e.target.value))}
              placeholder="Nome completo do viúvo(a)"
            />
            <FieldError value={formData.conjuge_nome} validator="nome" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conjuge_cpf">CPF do(a) Viúvo(a)</Label>
            <Input
              id="conjuge_cpf"
              value={formData.conjuge_cpf || ''}
              onChange={(e) => handleChange('conjuge_cpf', masks.cpf(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
            />
            <FieldError value={formData.conjuge_cpf} validator="cpf" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conjuge_rg">RG do Cônjuge</Label>
            <Input
              id="conjuge_rg"
              value={formData.conjuge_rg || ''}
              onChange={(e) => handleChange('conjuge_rg', masks.rg(e.target.value))}
              placeholder="Somente números"
              maxLength={15}
            />
            <FieldError value={formData.conjuge_rg} validator="rg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conjuge_nacionalidade">Nacionalidade</Label>
            <Input
              id="conjuge_nacionalidade"
              value={formData.conjuge_nacionalidade || 'Brasileira'}
              onChange={(e) => handleChange('conjuge_nacionalidade', masks.onlyLetters(e.target.value))}
              placeholder="Nacionalidade"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conjuge_profissao">Profissão</Label>
            <Input
              id="conjuge_profissao"
              value={formData.conjuge_profissao || ''}
              onChange={(e) => handleChange('conjuge_profissao', masks.onlyLetters(e.target.value))}
              placeholder="Profissão do cônjuge"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="conjuge_endereco">Endereço</Label>
            <Input
              id="conjuge_endereco"
              value={formData.conjuge_endereco || ''}
              onChange={(e) => handleChange('conjuge_endereco', e.target.value)}
              placeholder="Mesmo do falecido, se aplicável" />

          </div>
          <div className="space-y-2">
            <Label htmlFor="conjuge_cep">CEP</Label>
            <Input
              id="conjuge_cep"
              value={formData.conjuge_cep || ''}
              onChange={(e) => handleChange('conjuge_cep', masks.cep(e.target.value))}
              placeholder="00000-000"
              maxLength={9} />
            <FieldError value={formData.conjuge_cep} validator="cep" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conjuge_telefone">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="conjuge_telefone"
                className="pl-10"
                value={formData.conjuge_telefone || ''}
                onChange={(e) => handleChange('conjuge_telefone', masks.phone(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={15} />
              <FieldError value={formData.conjuge_telefone} validator="phone" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="conjuge_email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="conjuge_email"
                type="email"
                className="pl-10"
                value={formData.conjuge_email || ''}
                onChange={(e) => handleChange('conjuge_email', e.target.value)}
                placeholder="email@exemplo.com" />
              <FieldError value={formData.conjuge_email} validator="email" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_atendimento">Data do Atendimento</Label>
            <Input
              id="data_atendimento"
              type="date"
              max="9999-12-31"
              value={formData.data_atendimento || ''}
              onChange={(e) => handleChange('data_atendimento', e.target.value)} />

          </div>
        </div>

        {/* Documentos Gerais do Caso */}
        <div className="space-y-4 p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <Label className="font-semibold text-blue-800">Documentos do Caso</Label>
          </div>
          <p className="text-xs text-blue-600">Anexe procurações, certidões, comprovantes e outros documentos relevantes.</p>
          <FileUpload
            value={formData.documentos_urls || []}
            onChange={(urls) => handleChange("documentos_urls", urls)}
            label="Anexar Documentos"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            multiple={true}
          />
        </div>
      </div>
    </div>);

}