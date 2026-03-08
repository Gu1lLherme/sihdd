import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Trash2, Edit, X, MapPin, Mail, Phone, Calendar, Heart } from "lucide-react";

const REGIME_LABELS = {
  comunhao_universal: "Comunhão Universal",
  comunhao_parcial: "Comunhão Parcial",
  separacao_total: "Separação Total",
  separacao_obrigatoria: "Separação Obrigatória",
  participacao_final: "Participação Final nos Aquestos",
  uniao_estavel: "União Estável",
};

const ESTADO_CIVIL_LABELS = {
  solteiro: "Solteiro(a)",
  casado: "Casado(a)",
  divorciado: "Divorciado(a)",
  viuvo: "Viúvo(a)",
  uniao_estavel: "União Estável",
  separado_judicialmente: "Separado(a) Judicialmente",
};

function InfoField({ label, value, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
      <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </p>
      <p className="text-sm font-medium text-[#333333]">{value}</p>
    </div>
  );
}

function DetalhesFalecido({ person, onClose }) {
  return (
    <Card className="border-2 border-slate-800 h-full sticky top-6">
      <CardHeader className="bg-slate-100 border-b-2 border-slate-800 flex flex-row items-center justify-between p-4">
        <CardTitle className="text-[#333333] text-lg">Falecido(a)</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-bold text-xl text-[#333333] leading-tight">{person.nome}</h3>
          <Badge className="mt-2 text-sm px-3 py-1 bg-slate-200 text-slate-700 border-0">
            De Cujus
          </Badge>
        </div>
        <div className="space-y-3 pt-2">
          <InfoField label="CPF" value={person.cpf} />
          <InfoField label="RG" value={person.rg && person.orgao_expedidor ? `${person.rg} - ${person.orgao_expedidor}` : person.rg} />
          <InfoField label="Sexo" value={person.sexo === 'masculino' ? 'Masculino' : person.sexo === 'feminino' ? 'Feminino' : null} />
          <InfoField label="Nacionalidade" value={person.nacionalidade} />
          <InfoField label="Data de Nascimento" icon={Calendar} value={person.data_nascimento ? new Date(person.data_nascimento).toLocaleDateString('pt-BR') : null} />
          <InfoField label="Data do Óbito" icon={Calendar} value={person.data_obito ? new Date(person.data_obito).toLocaleDateString('pt-BR') : null} />
          <InfoField label="Estado Civil" value={ESTADO_CIVIL_LABELS[person.estado_civil]} />
          <InfoField label="Regime de Bens" icon={Heart} value={REGIME_LABELS[person.regime_bens]} />
          <InfoField label="Endereço" icon={MapPin} value={person.endereco} />
          <InfoField label="CEP" value={person.cep} />
        </div>
      </CardContent>
    </Card>
  );
}

function DetalhesConjuge({ person, onClose }) {
  return (
    <Card className="border-2 border-pink-600 h-full sticky top-6">
      <CardHeader className="bg-pink-50 border-b-2 border-pink-600 flex flex-row items-center justify-between p-4">
        <CardTitle className="text-[#333333] text-lg">Cônjuge Sobrevivente</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-pink-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-bold text-xl text-[#333333] leading-tight">{person.nome}</h3>
          <Badge className="mt-2 text-sm px-3 py-1 bg-pink-100 text-pink-700 border-0">
            Cônjuge / Companheiro(a)
          </Badge>
        </div>
        <div className="space-y-3 pt-2">
          <InfoField label="CPF" value={person.cpf} />
          <InfoField label="Email" icon={Mail} value={person.email} />
          <InfoField label="Telefone" icon={Phone} value={person.telefone} />
          <InfoField label="Data do Casamento" icon={Calendar} value={person.data_casamento ? new Date(person.data_casamento).toLocaleDateString('pt-BR') : null} />
          <InfoField label="Regime de Bens" icon={Heart} value={REGIME_LABELS[person.regime_bens]} />
          <InfoField label="Endereço" icon={MapPin} value={person.endereco} />
          <InfoField label="CEP" value={person.cep} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DetalhesMembro({ selectedPerson, onClose, onEdit, onDelete }) {
  if (!selectedPerson) {
    return (
      <Card className="border-2 border-slate-200 border-dashed h-full flex items-center justify-center min-h-[300px]">
        <CardContent className="p-8 text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Clique em um membro na árvore para ver seus detalhes</p>
        </CardContent>
      </Card>
    );
  }

  if (selectedPerson._tipo === 'falecido') {
    return <DetalhesFalecido person={selectedPerson} onClose={onClose} />;
  }

  if (selectedPerson._tipo === 'conjuge') {
    return <DetalhesConjuge person={selectedPerson} onClose={onClose} />;
  }

  return (
    <Card className="border-2 border-[#4169E1] h-full sticky top-6">
      <CardHeader className="bg-blue-50 border-b-2 border-[#4169E1] flex flex-row items-center justify-between p-4">
        <CardTitle className="text-[#333333] text-lg">Detalhes</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4169E1] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="font-bold text-xl text-[#333333] leading-tight">{selectedPerson.nome}</h3>
          <Badge className="mt-2 text-sm px-3 py-1 bg-blue-100 text-[#4169E1] hover:bg-blue-200 border-0">
            {selectedPerson.parentesco}
          </Badge>
        </div>

        <div className="space-y-4 pt-2">
          <InfoField label="CPF" value={selectedPerson.cpf || "Não informado"} />
          <InfoField label="Email" icon={Mail} value={selectedPerson.email || "Não informado"} />
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Participação na Partilha</p>
            <div className="flex items-center justify-between">
               <p className="text-xl font-bold text-[#4169E1]">{selectedPerson.percentual_partilha}%</p>
               <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4169E1]" style={{width: `${selectedPerson.percentual_partilha}%`}}></div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
              variant="outline" 
              className="w-full border-[#4169E1] text-[#4169E1] hover:bg-blue-50"
              onClick={() => onEdit(selectedPerson)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}