import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { masks } from "@/components/Masks";
import { FieldError } from "@/components/validations";
import { Calendar, User, FileText, Phone, Mail, AlertCircle } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import AddressInput from "@/components/AddressInput";
import CpfUnicoValidator from "@/components/novocaso/CpfUnicoValidator";
import DateBeforeObitoValidator from "@/components/novocaso/DateBeforeObitoValidator";

const TODAY = new Date().toISOString().split('T')[0];
const MIN_DATE = "1600-01-01";

export default function DadosConjuge({ formData, setFormData }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Regime de Bens e Data do Casamento */}
      <div className="space-y-6">
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
            <CpfUnicoValidator cpf={formData.conjuge_cpf} formData={formData} ownerLabel="conjuge" infoOnly />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conjuge_rg">RG do Cônjuge</Label>
            <Input
              id="conjuge_rg"
              value={formData.conjuge_rg || ''}
              onChange={(e) => handleChange('conjuge_rg', masks.rg(e.target.value))}
              placeholder="00.000.000-0"
              maxLength={12}
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

        <AddressInput
          prefix="conjuge"
          values={{
            cep: formData.conjuge_cep,
            logradouro: formData.conjuge_logradouro,
            numero: formData.conjuge_numero,
            bairro: formData.conjuge_bairro,
            cidade: formData.conjuge_cidade,
            uf: formData.conjuge_uf,
          }}
          onChange={(field, value) => {
            const fieldMap = { cep: 'conjuge_cep', logradouro: 'conjuge_logradouro', numero: 'conjuge_numero', bairro: 'conjuge_bairro', cidade: 'conjuge_cidade', uf: 'conjuge_uf' };
            handleChange(fieldMap[field], value);
          }}
          onAddressFound={({ logradouro, bairro, cidade, uf }) => {
            setFormData(prev => ({
              ...prev,
              conjuge_logradouro: logradouro,
              conjuge_bairro: bairro,
              conjuge_cidade: cidade,
              conjuge_uf: uf,
            }));
          }}
        />

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
              min={MIN_DATE}
              max={TODAY}
              value={formData.data_atendimento || ''}
              onChange={(e) => handleChange('data_atendimento', e.target.value)} />
            <FieldError value={formData.data_atendimento} validator="datePastOnly" />
          </div>
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
                min={formData.data_nascimento || MIN_DATE}
                max={formData.data_obito || TODAY}
                className="pl-10"
                value={formData.data_casamento || ''}
                onChange={(e) => handleChange('data_casamento', e.target.value)} />
              <FieldError value={formData.data_casamento} validator="datePastOnly" />
              <DateBeforeObitoValidator date={formData.data_casamento} dataObito={formData.data_obito} label="Data do casamento" />
            </div>
            <p className="text-xs text-slate-500">Importante para classificar bens em comuns ou particulares</p>
          </div>
        </div>

        {/* Regra dos 25% */}
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

        {/* Certidão de Casamento */}
        <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <Label className="font-semibold text-slate-700">Certidão de Casamento</Label>
          </div>
          <Label className="text-slate-600 mb-2 block text-sm">Anexar Certidão de Casamento (apenas 1 documento)</Label>
          <FileUpload
            value={formData.certidao_casamento_url || ""}
            onChange={(url) => handleChange("certidao_casamento_url", url)}
            label="Anexar Certidão de Casamento"
            accept=".pdf,.jpg,.jpeg,.png"
            maxFiles={1}
          />
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
    </div>
  );
}