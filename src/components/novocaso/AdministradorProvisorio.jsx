import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { masks } from "@/components/Masks";
import { User, CreditCard, MapPin, Mail, Phone, Heart } from "lucide-react";

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
            onChange={(e) => handleChange('nome', e.target.value)}
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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="admin_endereco">Endereço Completo</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="admin_endereco"
              className="pl-10"
              value={data.endereco || ''}
              onChange={(e) => handleChange('endereco', e.target.value)}
              placeholder="Rua, Número, Bairro"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_cep">CEP</Label>
          <Input
            id="admin_cep"
            value={data.cep || ''}
            onChange={(e) => handleChange('cep', masks.cep(e.target.value))}
            placeholder="00000-000"
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
            />
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
              onChange={(e) => handleChange('conjuge_nome', e.target.value)}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}