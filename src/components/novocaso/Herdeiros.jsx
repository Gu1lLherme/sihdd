import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Users } from "lucide-react";
import { masks } from "@/components/Masks";

export default function Herdeiros({ formData, setFormData }) {
  const addHerdeiro = () => {
    setFormData({
      ...formData,
      herdeiros: [
        ...formData.herdeiros,
        {
          nome: "",
          cpf: "",
          parentesco: "filho",
          condicao_especial: "nenhuma",
          percentual_partilha: 0,
          email: "",
          telefone: "",
          e_filho_conjuge: true,
        },
      ],
    });
  };

  const removeHerdeiro = (index) => {
    setFormData({
      ...formData,
      herdeiros: formData.herdeiros.filter((_, i) => i !== index),
    });
  };

  const updateHerdeiro = (index, field, value) => {
    const newHerdeiros = [...formData.herdeiros];
    newHerdeiros[index] = { ...newHerdeiros[index], [field]: value };
    setFormData({ ...formData, herdeiros: newHerdeiros });
  };

  const totalPercentual = formData.herdeiros.reduce(
    (sum, h) => sum + (parseFloat(h.percentual_partilha) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Lista de Herdeiros</h3>
        </div>
        <Button onClick={addHerdeiro} variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Herdeiro
        </Button>
      </div>

      {formData.herdeiros.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum herdeiro adicionado ainda</p>
            <p className="text-sm text-slate-400 mt-2">
              Clique em "Adicionar Herdeiro" para começar
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {formData.herdeiros.map((herdeiro, index) => (
            <Card key={index} className="border-slate-200 shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-200 flex-row justify-between items-center">
                <CardTitle className="text-base">Herdeiro {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHerdeiro(index)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input
                      value={herdeiro.nome}
                      onChange={(e) => updateHerdeiro(index, "nome", e.target.value)}
                      placeholder="Nome do herdeiro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={herdeiro.cpf}
                      onChange={(e) => updateHerdeiro(index, "cpf", masks.cpf(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>RG</Label>
                    <Input
                      value={herdeiro.rg || ''}
                      onChange={(e) => updateHerdeiro(index, "rg", e.target.value)}
                      placeholder="RG"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Parentesco *</Label>
                    <Select
                      value={herdeiro.parentesco}
                      onValueChange={(value) => updateHerdeiro(index, "parentesco", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conjuge">Cônjuge</SelectItem>
                        <SelectItem value="filho">Filho(a)</SelectItem>
                        <SelectItem value="pai">Pai</SelectItem>
                        <SelectItem value="mae">Mãe</SelectItem>
                        <SelectItem value="irmao">Irmão/Irmã</SelectItem>
                        <SelectItem value="neto">Neto(a)</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Condição Especial</Label>
                    <Select
                      value={herdeiro.condicao_especial || "nenhuma"}
                      onValueChange={(value) => updateHerdeiro(index, "condicao_especial", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nenhuma">Nenhuma</SelectItem>
                        <SelectItem value="menor">Menor</SelectItem>
                        <SelectItem value="menor_emancipado">Menor Emancipado</SelectItem>
                        <SelectItem value="incapacidade_temporaria">Incapacidade Temporária</SelectItem>
                        <SelectItem value="interditado">Interditado</SelectItem>
                        <SelectItem value="curatela">Curatela</SelectItem>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="nascituro">Nascituro</SelectItem>
                        <SelectItem value="herdeiro_excluido">Herdeiro Excluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {['filho', 'filha', 'neto', 'neta'].includes(herdeiro.parentesco) && (
                    <div className="space-y-2">
                      <Label>É filho(a) do cônjuge sobrevivente?</Label>
                      <Select
                        value={herdeiro.e_filho_conjuge === false ? "nao" : "sim"}
                        onValueChange={(value) => updateHerdeiro(index, "e_filho_conjuge", value === "sim")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não (enteado)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">Afeta a regra dos 25% do cônjuge</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Percentual da Partilha (%)</Label>
                    <Input
                      type="number"
                      value={herdeiro.percentual_partilha || ''}
                      onChange={(e) =>
                        updateHerdeiro(index, "percentual_partilha", parseFloat(e.target.value) || 0)
                      }
                      placeholder="Calculado automaticamente"
                      min="0"
                      max="100"
                      step="0.01"
                      disabled
                    />
                    <p className="text-xs text-slate-500">Será calculado automaticamente</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={herdeiro.email}
                      onChange={(e) => updateHerdeiro(index, "email", e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={herdeiro.telefone}
                      onChange={(e) => updateHerdeiro(index, "telefone", masks.phone(e.target.value))}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {formData.herdeiros.length > 0 && (
        <Card className={`border-2 ${totalPercentual === 100 ? 'border-green-200 bg-green-50' : totalPercentual > 100 ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Total da Partilha:</p>
              <p className={`text-2xl font-bold ${totalPercentual === 100 ? 'text-green-600' : totalPercentual > 100 ? 'text-red-600' : 'text-amber-600'}`}>
                {totalPercentual.toFixed(2)}%
              </p>
            </div>
            {totalPercentual !== 100 && (
              <p className="text-sm mt-2 text-slate-600">
                {totalPercentual > 100
                  ? "⚠️ O total ultrapassa 100%. Ajuste os percentuais."
                  : "⚠️ O total deve somar 100%."}
              </p>
            )}
            {totalPercentual === 100 && (
              <p className="text-sm mt-2 text-green-600">
                ✓ Partilha correta! Os percentuais somam 100%.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}