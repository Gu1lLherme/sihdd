import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { masks } from "@/components/Masks";
import { validators, FieldError } from "@/components/validations";
import { User, CreditCard, Mail, Phone, Heart } from "lucide-react";
import CpfUnicoValidator from "@/components/novocaso/CpfUnicoValidator";
import AddressInput from "@/components/AddressInput";

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
            placeholder="Nome do administrador" />
          
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_cpf">CPF</Label>
          <Input
            id="admin_cpf"
            value={data.cpf || ''}
            onChange={(e) => handleChange('cpf', masks.cpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14} />
          
          <FieldError value={data.cpf} validator="cpf" />
          <CpfUnicoValidator cpf={data.cpf} formData={formData} ownerLabel="admin" />
        </div>
      </div>

      <AddressInput
        prefix="admin"
        values={{
          cep: data.cep,
          logradouro: data.logradouro,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf
        }}
        onChange={(field, value) => handleChange(field, value)}
        onAddressFound={({ logradouro, bairro, cidade, uf }) => {
          setFormData((prev) => ({
            ...prev,
            administrador_provisorio: {
              ...prev.administrador_provisorio,
              logradouro,
              bairro,
              cidade,
              uf
            }
          }));
        }} />
      

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
              placeholder="email@exemplo.com" />
            
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
              maxLength={15} />
            
            <FieldError value={data.telefone} validator="phone" />
          </div>
        </div>
      </div>

      



























      
    </div>);

}