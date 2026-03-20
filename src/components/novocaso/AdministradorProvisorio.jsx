import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { masks } from "@/components/Masks";
import { validators, FieldError } from "@/components/validations";
import { User, CreditCard, MapPin, Mail, Phone, Heart } from "lucide-react";
import CpfUnicoValidator from "@/components/novocaso/CpfUnicoValidator";
import CepInput from "@/components/novocaso/CepInput";

export default function AdministradorProvisorio({ formData, setFormData }) {
  const data = formData.administrador_provisorio || {};

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      administrador_provisorio: {
        ...prev.administrador_provisorio,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b pb-2 border-slate-200">
        <User className="w-5 h-5 text-blue-900" />
        <h3 className="font-bold text-xl text-blue-900">Dados do Administrador Provisório</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="admin_nome">Nome Completo</Label>
          <Input
            id="admin_nome"
            value={data.nome || ''}
            onChange={(e) => handleChange('nome', masks.onlyLetters(e.target.value))}
            placeholder="Nome do administrador"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_cpf">CPF</Label>
          <Input
            id="admin_cpf"
            value={data.cpf || ''}
            onChange={(e) => handleChange('cpf', masks.cpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          <FieldError value={data.cpf} validator="cpf" />
          <CpfUnicoValidator cpf={data.cpf} formData={formData} ownerLabel="admin" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CepInput
          id="admin_cep"
          label="CEP"
          cepValue={data.cep}
          onCepChange={(val) => handleChange('cep', val)}
          onAddressFound={({ logradouro, bairro, cidade, uf }) => {
            setFormData(prev => ({
              ...prev,
              administrador_provisorio: {
                ...prev.administrador_provisorio,
                logradouro,
                bairro,
                cidade,
                uf,
              }
            }));
          }}
        />
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="admin_logradouro">Logradouro</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="admin_logradouro"
              className="pl-10"
              value={data.logradouro || ''}
              onChange={(e) => handleChange('logradouro', e.target.value)}
              placeholder="Rua, Avenida..."
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_numero">Número</Label>
          <Input
            id="admin_numero"
            value={data.numero || ''}
            onChange={(e) => handleChange('numero', e.target.value)}
            placeholder="Nº"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="admin_bairro">Bairro</Label>
          <Input
            id="admin_bairro"
            value={data.bairro || ''}
            onChange={(e) => handleChange('bairro', e.target.value)}
            placeholder="Bairro"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_cidade">Cidade</Label>
          <Input
            id="admin_cidade"
            value={data.cidade || ''}
            onChange={(e) => handleChange('cidade', e.target.value)}
            placeholder="Cidade"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_uf">UF</Label>
          <Input
            id="admin_uf"
            value={data.uf || ''}
            onChange={(e) => handleChange('uf', e.target.value.toUpperCase())}
            placeholder="SP"
            maxLength={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="admin_email">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="admin_email"
              type="email"
              className="pl-10"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@exemplo.com"
            />
            <FieldError value={data.email} validator="email" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_telefone">Telefone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="admin_telefone"
              className="pl-10"
              value={data.telefone || ''}
              onChange={(e) => handleChange('telefone', masks.phone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
            <FieldError value={data.telefone} validator="phone" />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <h4 className="font-semibold text-slate-700">Cônjuge do Administrador</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="admin_conjuge_nome">Nome do Cônjuge</Label>
            <Input
              id="admin_conjuge_nome"
              value={data.conjuge_nome || ''}
              onChange={(e) => handleChange('conjuge_nome', masks.onlyLetters(e.target.value))}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin_conjuge_cpf">CPF do Cônjuge</Label>
            <Input
              id="admin_conjuge_cpf"
              value={data.conjuge_cpf || ''}
              onChange={(e) => handleChange('conjuge_cpf', masks.cpf(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
            />
            <FieldError value={data.conjuge_cpf} validator="cpf" />
            <CpfUnicoValidator cpf={data.conjuge_cpf} formData={formData} ownerLabel="admin_conjuge" />
          </div>
        </div>
      </div>
    </div>
  );
}