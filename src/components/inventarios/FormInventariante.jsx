import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Calendar as CalendarIcon } from "lucide-react";
import { masks } from "@/components/Masks";
import { FieldError } from "@/components/validations";
import DateAfterBirthValidator from "@/components/novocaso/DateAfterBirthValidator";
import CepInput from "@/components/novocaso/CepInput";

const TODAY = new Date().toISOString().split('T')[0];
const MIN_DATE = "1600-01-01";

export default function FormInventariante({ data, onChange, readOnly = false, formData }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-emerald-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
            <UserCheck className="w-5 h-5" />
            Dados do Inventariante
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome Completo *</Label>
            <Input 
              id="inv_nome"
              value={data.nome || ""} 
              onChange={(e) => handleChange("nome", masks.onlyLetters(e.target.value))}
              placeholder="Nome do inventariante"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>CPF / CNPJ *</Label>
            <Input 
              id="inv_cpf_cnpj"
              value={data.cpf_cnpj || ""} 
              onChange={(e) => handleChange("cpf_cnpj", masks.cpf(e.target.value))}
              placeholder="000.000.000-00"
              readOnly={readOnly}
              maxLength={14}
            />
            <FieldError value={data.cpf_cnpj} validator="cpf" />
          </div>
          <div className="space-y-2">
            <Label>E-mail Principal *</Label>
            <Input 
              id="inv_email"
              value={data.email || ""} 
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@exemplo.com"
              type="email"
              readOnly={readOnly}
            />
            <FieldError value={data.email} validator="email" />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input 
              id="inv_telefone"
              value={data.telefone || ""} 
              onChange={(e) => handleChange("telefone", masks.phone(e.target.value))}
              placeholder="(00) 00000-0000"
              readOnly={readOnly}
              maxLength={15}
            />
            <FieldError value={data.telefone} validator="phone" />
          </div>
          <div className="space-y-2">
            <CepInput
              id="inv_cep"
              label="CEP"
              cepValue={data.cep}
              onCepChange={(val) => handleChange("cep", val)}
              onAddressFound={({ logradouro, bairro, cidade, uf }) => {
                onChange({
                  ...data,
                  logradouro,
                  bairro,
                  cidade,
                  uf,
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Logradouro</Label>
            <Input 
              value={data.logradouro || ""} 
              onChange={(e) => handleChange("logradouro", e.target.value)}
              placeholder="Rua, Avenida..."
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Número</Label>
            <Input 
              value={data.numero || ""} 
              onChange={(e) => handleChange("numero", e.target.value)}
              placeholder="Nº"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Bairro</Label>
            <Input 
              value={data.bairro || ""} 
              onChange={(e) => handleChange("bairro", e.target.value)}
              placeholder="Bairro"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Input 
              value={data.cidade || ""} 
              onChange={(e) => handleChange("cidade", e.target.value)}
              placeholder="Cidade"
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>UF</Label>
            <Input 
              value={data.uf || ""} 
              onChange={(e) => handleChange("uf", e.target.value.toUpperCase())}
              placeholder="SP"
              readOnly={readOnly}
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Data da Nomeação *</Label>
            <div className="relative">
              <Input 
                id="inv_data_nomeacao"
                value={data.data_nomeacao || ""} 
                onChange={(e) => handleChange("data_nomeacao", e.target.value)}
                type="date"
                min={formData?.data_nascimento || MIN_DATE}
                max={TODAY}
                readOnly={readOnly}
              />
            </div>
            <FieldError value={data.data_nomeacao} validator="datePastOnly" />
            <DateAfterBirthValidator date={data.data_nomeacao} dataNascimento={formData?.data_nascimento} label="Data de nomeação" />
            <p className="text-xs text-slate-500">
              * Define o início da contagem de prazos
            </p>
          </div>
          <div className="space-y-2">
            <Label>Vínculo com o Espólio *</Label>
            <Select 
              value={data.vinculo} 
              onValueChange={(val) => handleChange("vinculo", val)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o vínculo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conjuge">Cônjuge / Companheiro(a)</SelectItem>
                <SelectItem value="herdeiro">Herdeiro</SelectItem>
                <SelectItem value="dativo">Dativo</SelectItem>
                <SelectItem value="testamenteiro">Testamenteiro</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!readOnly && (
            <div className="space-y-2 md:col-span-2">
              <Label>Status da Representação</Label>
              <Select 
                value={data.status || "ativo"} 
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="substituido">Substituído</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}