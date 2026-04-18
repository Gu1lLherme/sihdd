import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { masks } from "@/components/Masks";
import { validators, FieldError } from "@/components/validations";
import { User, CreditCard, Mail, Phone, Heart } from "lucide-react";
import CpfUnicoValidator from "@/components/novocaso/CpfUnicoValidator";
import AddressInput from "@/components/AddressInput";

export default function AdministradorProvisorio({ formData, setFormData }) {
  const data = formData.administrador_provisorio || {};
  const vinculo = data.vinculo || "terceiro";

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      administrador_provisorio: {
        ...prev.administrador_provisorio,
        [field]: value
      }
    }));
  };

  // Ao mudar o vínculo, preenche automaticamente os dados da pessoa selecionada
  const handleVinculoChange = (novoVinculo) => {
    let dadosImportados = {};

    if (novoVinculo === "conjuge") {
      dadosImportados = {
        nome: formData.conjuge_nome || "",
        cpf: formData.conjuge_cpf || "",
        email: formData.conjuge_email || "",
        telefone: formData.conjuge_telefone || "",
        cep: formData.conjuge_cep || "",
        logradouro: formData.conjuge_logradouro || "",
        numero: formData.conjuge_numero || "",
        bairro: formData.conjuge_bairro || "",
        cidade: formData.conjuge_cidade || "",
        uf: formData.conjuge_uf || "",
      };
    } else if (novoVinculo.startsWith("herdeiro_")) {
      const idx = parseInt(novoVinculo.replace("herdeiro_", ""), 10);
      const h = (formData.herdeiros || [])[idx];
      if (h) {
        dadosImportados = {
          nome: h.nome || "",
          cpf: h.cpf || "",
          email: h.email || "",
          telefone: h.telefone || "",
          cep: h.cep || "",
          logradouro: h.logradouro || "",
          numero: h.numero || "",
          bairro: h.bairro || "",
          cidade: h.cidade || "",
          uf: h.uf || "",
        };
      }
    }
    // terceiro → mantém dados atuais ou vazio se trocou de herdeiro/cônjuge
    if (novoVinculo === "terceiro") {
      dadosImportados = {};
    }

    setFormData((prev) => ({
      ...prev,
      administrador_provisorio: {
        ...prev.administrador_provisorio,
        vinculo: novoVinculo,
        ...dadosImportados,
      }
    }));
  };

  const herdeirosValidos = (formData.herdeiros || []).filter(h => h.nome);
  const isReadOnly = vinculo === "conjuge" || vinculo.startsWith("herdeiro_");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b pb-2 border-slate-200">
        <User className="w-5 h-5 text-blue-900" />
        <h3 className="font-bold text-xl text-blue-900">Dados do Administrador Provisório</h3>
      </div>

      {/* Vínculo do Administrador */}
      <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Label htmlFor="admin_vinculo" className="text-blue-900 font-semibold">
          Quem é o Administrador Provisório? *
        </Label>
        <Select value={vinculo} onValueChange={handleVinculoChange}>
          <SelectTrigger id="admin_vinculo" className="bg-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="terceiro">Terceiro (não herdeiro / não cônjuge)</SelectItem>
            {formData.conjuge_nome && (
              <SelectItem value="conjuge">Cônjuge — {formData.conjuge_nome}</SelectItem>
            )}
            {herdeirosValidos.map((h, i) => {
              const idx = (formData.herdeiros || []).indexOf(h);
              return (
                <SelectItem key={idx} value={`herdeiro_${idx}`}>
                  Herdeiro {idx + 1} — {h.nome}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {isReadOnly && (
          <p className="text-xs text-blue-700">
            ℹ️ Os dados abaixo foram preenchidos automaticamente. Para editar, altere nos dados originais ou selecione "Terceiro".
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="admin_nome">Nome Completo</Label>
          <Input
            id="admin_nome"
            value={data.nome || ''}
            onChange={(e) => handleChange('nome', masks.onlyLetters(e.target.value))}
            placeholder="Nome do administrador"
            disabled={isReadOnly} />
          
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin_cpf">CPF</Label>
          <Input
            id="admin_cpf"
            value={data.cpf || ''}
            onChange={(e) => handleChange('cpf', masks.cpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength={14}
            disabled={isReadOnly} />
          
          <FieldError value={data.cpf} validator="cpf" />
          <CpfUnicoValidator cpf={data.cpf} formData={formData} ownerLabel="admin" infoOnly />
        </div>
      </div>

      <AddressInput
        prefix="admin"
        readOnly={isReadOnly}
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
              placeholder="email@exemplo.com"
              disabled={isReadOnly} />
            
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
              disabled={isReadOnly} />
            
            <FieldError value={data.telefone} validator="phone" />
          </div>
        </div>
      </div>

      



























      
    </div>);

}