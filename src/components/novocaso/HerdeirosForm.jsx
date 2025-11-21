import React from 'react';
import { masks } from "@/components/Masks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HerdeirosForm({ herdeiros, setHerdeiros }) {
  const addHerdeiro = () => {
    setHerdeiros([...herdeiros, {
      nome: "",
      cpf: "",
      parentesco: "",
      percentual_partilha: 0,
      email: "",
      telefone: "",
    }]);
  };

  const removeHerdeiro = (index) => {
    setHerdeiros(herdeiros.filter((_, i) => i !== index));
  };

  const updateHerdeiro = (index, field, value) => {
    const updated = [...herdeiros];
    updated[index] = { ...updated[index], [field]: value };
    setHerdeiros(updated);
  };

  const totalPercentual = herdeiros.reduce((sum, h) => sum + (parseFloat(h.percentual_partilha) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Herdeiros
          </h2>
          <p className="text-slate-600">Adicione todos os herdeiros do inventário</p>
        </div>
        <Button
          onClick={addHerdeiro}
          className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] hover:from-[#2d5a8f] hover:to-[#1e3a5f]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Herdeiro
        </Button>
      </div>

      {herdeiros.length === 0 && (
        <Card className="p-12 text-center border-2 border-dashed border-slate-300">
          <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Nenhum herdeiro adicionado
          </h3>
          <p className="text-slate-500 mb-4">
            Clique no botão acima para adicionar o primeiro herdeiro
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {herdeiros.map((herdeiro, index) => (
          <Card key={index} className="p-6 border-slate-200 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg text-[#1e3a5f]">
                Herdeiro {index + 1}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHerdeiro(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Nome Completo *</Label>
                <Input
                  value={herdeiro.nome}
                  onChange={(e) => updateHerdeiro(index, 'nome', e.target.value)}
                  placeholder="Pedro da Silva"
                  className="border-slate-300 focus:border-[#1e3a5f]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">CPF</Label>
                <Input
                  value={herdeiro.cpf}
                  onChange={(e) => updateHerdeiro(index, 'cpf', masks.cpf(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="border-slate-300 focus:border-[#1e3a5f]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Parentesco *</Label>
                <Select
                  value={herdeiro.parentesco}
                  onValueChange={(value) => updateHerdeiro(index, 'parentesco', value)}
                >
                  <SelectTrigger className="border-slate-300 focus:border-[#1e3a5f]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conjuge">Cônjuge</SelectItem>
                    <SelectItem value="filho">Filho</SelectItem>
                    <SelectItem value="filha">Filha</SelectItem>
                    <SelectItem value="pai">Pai</SelectItem>
                    <SelectItem value="mae">Mãe</SelectItem>
                    <SelectItem value="irmao">Irmão</SelectItem>
                    <SelectItem value="irma">Irmã</SelectItem>
                    <SelectItem value="neto">Neto</SelectItem>
                    <SelectItem value="neta">Neta</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Percentual da Partilha (%) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={herdeiro.percentual_partilha}
                  onChange={(e) => updateHerdeiro(index, 'percentual_partilha', e.target.value)}
                  placeholder="25"
                  className="border-slate-300 focus:border-[#1e3a5f]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Email</Label>
                <Input
                  type="email"
                  value={herdeiro.email}
                  onChange={(e) => updateHerdeiro(index, 'email', e.target.value)}
                  placeholder="herdeiro@email.com"
                  className="border-slate-300 focus:border-[#1e3a5f]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Telefone</Label>
                <Input
                  value={herdeiro.telefone}
                  onChange={(e) => updateHerdeiro(index, 'telefone', masks.phone(e.target.value))}
                  placeholder="(79) 99999-9999"
                  maxLength={15}
                  className="border-slate-300 focus:border-[#1e3a5f]"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {herdeiros.length > 0 && (
        <Card className={`p-4 ${totalPercentual === 100 ? 'bg-green-50 border-green-300' : totalPercentual > 100 ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
          <p className="text-center font-semibold">
            Total da Partilha: {totalPercentual.toFixed(2)}% 
            {totalPercentual === 100 && <span className="text-green-600 ml-2">✓ Correto</span>}
            {totalPercentual > 100 && <span className="text-red-600 ml-2">⚠️ Excede 100%</span>}
            {totalPercentual < 100 && totalPercentual > 0 && <span className="text-amber-600 ml-2">⚠️ Faltam {(100 - totalPercentual).toFixed(2)}%</span>}
          </p>
        </Card>
      )}
    </div>
  );
}