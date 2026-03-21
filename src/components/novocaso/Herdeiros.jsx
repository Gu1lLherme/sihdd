import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Users } from "lucide-react";
import { masks } from "@/components/Masks";
import { FieldError } from "@/components/validations";
import CpfUnicoValidator from "@/components/novocaso/CpfUnicoValidator";
import DateAfterBirthValidator from "@/components/novocaso/DateAfterBirthValidator";
import AddressInput from "@/components/AddressInput";

const TODAY = new Date().toISOString().split('T')[0];
const MIN_DATE = "1600-01-01";

export default function Herdeiros({ formData, setFormData }) {
  const lastHerdeiroRef = useRef(null);
  const prevCountRef = useRef(formData.herdeiros.length);

  useEffect(() => {
    if (formData.herdeiros.length > prevCountRef.current && lastHerdeiroRef.current) {
      lastHerdeiroRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    prevCountRef.current = formData.herdeiros.length;
  }, [formData.herdeiros.length]);

  const addHerdeiro = () => {
    setFormData((prev) => ({
      ...prev,
      herdeiros: [
        ...prev.herdeiros,
        {
          nome: "",
          cpf: "",
          rg: "",
          data_nascimento: "",
          nacionalidade: "Brasileira",
          profissao: "",
          estado_civil: "solteiro",
          cep: "",
          logradouro: "",
          numero: "",
          bairro: "",
          cidade: "",
          uf: "",
          parentesco: "filho",
          condicao_especial: "nenhuma",
          percentual_partilha: 0,
          email: "",
          telefone: "",
          e_filho_conjuge: true,
          representante_legal_nome: "",
          representante_legal_cpf: "",
          representante_legal_telefone: "",
        },
      ],
    }));
  };

  const removeHerdeiro = (index) => {
    setFormData((prev) => ({
      ...prev,
      herdeiros: prev.herdeiros.filter((_, i) => i !== index),
    }));
  };

  const updateHerdeiro = (index, field, value) => {
    setFormData((prev) => {
      const newHerdeiros = [...prev.herdeiros];
      newHerdeiros[index] = { ...newHerdeiros[index], [field]: value };
      return { ...prev, herdeiros: newHerdeiros };
    });
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
            <Card key={index} ref={index === formData.herdeiros.length - 1 ? lastHerdeiroRef : null} className="border-slate-200 shadow-md">
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
                      id={`herdeiro_${index}_nome`}
                      value={herdeiro.nome}
                      onChange={(e) => updateHerdeiro(index, "nome", masks.onlyLetters(e.target.value))}
                      placeholder="Nome do herdeiro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      id={`herdeiro_${index}_cpf`}
                      value={herdeiro.cpf || ''}
                      onChange={(e) => updateHerdeiro(index, "cpf", masks.cpf(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                    <FieldError value={herdeiro.cpf} validator="cpf" />
                    <CpfUnicoValidator cpf={herdeiro.cpf} formData={formData} ownerLabel={`herdeiro_${index}`} />
                  </div>

                  <div className="space-y-2">
                    <Label>RG</Label>
                    <Input
                      id={`herdeiro_${index}_rg`}
                      value={herdeiro.rg || ''}
                      onChange={(e) => updateHerdeiro(index, "rg", masks.rg(e.target.value))}
                      placeholder="00.000.000-0"
                      maxLength={12}
                    />
                    <FieldError value={herdeiro.rg} validator="rg" />
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Nascimento</Label>
                    <Input
                      type="date"
                      min={formData.data_nascimento || MIN_DATE}
                      max={TODAY}
                      value={herdeiro.data_nascimento || ''}
                      onChange={(e) => updateHerdeiro(index, "data_nascimento", e.target.value)}
                    />
                    <FieldError value={herdeiro.data_nascimento} validator="datePastOnly" />
                    <DateAfterBirthValidator date={herdeiro.data_nascimento} dataNascimento={formData.data_nascimento} label="Data de nascimento do herdeiro" />
                  </div>

                  <div className="space-y-2">
                    <Label>Nacionalidade</Label>
                    <Input
                      value={herdeiro.nacionalidade || 'Brasileira'}
                      onChange={(e) => updateHerdeiro(index, "nacionalidade", masks.onlyLetters(e.target.value))}
                      placeholder="Nacionalidade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Profissão</Label>
                    <Input
                      value={herdeiro.profissao || ''}
                      onChange={(e) => updateHerdeiro(index, "profissao", masks.onlyLetters(e.target.value))}
                      placeholder="Profissão"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <Select
                      value={herdeiro.estado_civil || "solteiro"}
                      onValueChange={(value) => updateHerdeiro(index, "estado_civil", value)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        <SelectItem value="uniao_estavel">União Estável</SelectItem>
                        <SelectItem value="menor">Menor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <AddressInput
                      prefix={`herdeiro_${index}`}
                      values={{
                        cep: herdeiro.cep,
                        logradouro: herdeiro.logradouro,
                        numero: herdeiro.numero,
                        bairro: herdeiro.bairro,
                        cidade: herdeiro.cidade,
                        uf: herdeiro.uf,
                      }}
                      onChange={(field, value) => updateHerdeiro(index, field, value)}
                      onAddressFound={({ logradouro, bairro, cidade, uf }) => {
                        setFormData(prev => {
                          const newHerdeiros = [...prev.herdeiros];
                          newHerdeiros[index] = {
                            ...newHerdeiros[index],
                            logradouro,
                            bairro,
                            cidade,
                            uf,
                          };
                          return { ...prev, herdeiros: newHerdeiros };
                        });
                      }}
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
                        <SelectItem value="filho">Filho</SelectItem>
                        <SelectItem value="filha">Filha</SelectItem>
                        <SelectItem value="pai">Pai</SelectItem>
                        <SelectItem value="mae">Mãe</SelectItem>
                        <SelectItem value="irmao">Irmão</SelectItem>
                        <SelectItem value="irma">Irmã</SelectItem>
                        <SelectItem value="neto">Neto</SelectItem>
                        <SelectItem value="neta">Neta</SelectItem>
                        <SelectItem value="sobrinho">Sobrinho</SelectItem>
                        <SelectItem value="sobrinha">Sobrinha</SelectItem>
                        <SelectItem value="tio">Tio</SelectItem>
                        <SelectItem value="tia">Tia</SelectItem>
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
                      id={`herdeiro_${index}_email`}
                      type="email"
                      value={herdeiro.email || ''}
                      onChange={(e) => updateHerdeiro(index, "email", e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                    <FieldError value={herdeiro.email} validator="email" />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      id={`herdeiro_${index}_telefone`}
                      value={herdeiro.telefone || ''}
                      onChange={(e) => updateHerdeiro(index, "telefone", masks.phone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                    <FieldError value={herdeiro.telefone} validator="phone" />
                  </div>
                </div>

                {/* Representante Legal - aparece para menores/incapazes */}
                {['menor', 'menor_emancipado', 'interditado', 'curatela', 'nascituro'].includes(herdeiro.condicao_especial) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                    <p className="text-sm font-semibold text-blue-900">Representante Legal</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Nome do Representante</Label>
                        <Input
                          value={herdeiro.representante_legal_nome || ''}
                          onChange={(e) => updateHerdeiro(index, "representante_legal_nome", masks.onlyLetters(e.target.value))}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CPF do Representante</Label>
                        <Input
                          value={herdeiro.representante_legal_cpf || ''}
                          onChange={(e) => updateHerdeiro(index, "representante_legal_cpf", masks.cpf(e.target.value))}
                          placeholder="000.000.000-00"
                          maxLength={14}
                        />
                        <FieldError value={herdeiro.representante_legal_cpf} validator="cpf" />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone do Representante</Label>
                        <Input
                          value={herdeiro.representante_legal_telefone || ''}
                          onChange={(e) => updateHerdeiro(index, "representante_legal_telefone", masks.phone(e.target.value))}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                        />
                        <FieldError value={herdeiro.representante_legal_telefone} validator="phone" />
                      </div>
                    </div>
                  </div>
                )}
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