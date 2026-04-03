import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Home, Car, Wallet, TrendingUp, Building2, Package } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { masks } from "@/components/Masks";
import { FieldError } from "@/components/validations";
import FileUpload from "@/components/FileUpload";
import DateAfterBirthValidator from "@/components/novocaso/DateAfterBirthValidator";
import AddressInput from "@/components/AddressInput";

const TODAY = new Date().toISOString().split('T')[0];
const MIN_DATE = "1600-01-01";

const bemIcons = {
  imovel: Home,
  veiculo: Car,
  conta_bancaria: Wallet,
  investimento: TrendingUp,
  empresa: Building2,
  outros: Package,
};

export default function Bens({ formData, setFormData }) {
  const addBem = () => {
    setFormData((prev) => ({
      ...prev,
      bens: [
        ...prev.bens,
        {
          tipo: "imovel",
          descricao: "",
          valor: 0,
          identificacao: "",
          observacoes: "",
          data_aquisicao: "",
          origem_bem: "onerosa",
        },
      ],
    }));
  };

  const removeBem = (index) => {
    setFormData((prev) => ({
      ...prev,
      bens: prev.bens.filter((_, i) => i !== index),
    }));
  };

  const updateBem = (index, field, value) => {
    setFormData((prev) => {
      const newBens = [...prev.bens];
      newBens[index] = { ...newBens[index], [field]: value };
      return { ...prev, bens: newBens };
    });
  };

  const totalPatrimonio = formData.bens.reduce(
    (sum, b) => sum + (parseFloat(b.valor) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Patrimônio do Espólio</h3>
        </div>
        <Button onClick={addBem} variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Bem
        </Button>
      </div>

      {formData.bens.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum bem adicionado ainda</p>
            <p className="text-sm text-slate-400 mt-2">
              Clique em "Adicionar Bem" para começar
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {formData.bens.map((bem, index) => {
            const Icon = bemIcons[bem.tipo] || Package;
            return (
              <Card key={index} className="border-slate-200 shadow-md">
                <CardHeader className="bg-slate-50 border-b border-slate-200 flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-base">Bem {index + 1}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBem(index)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Bem *</Label>
                      <Select
                        value={bem.tipo}
                        onValueChange={(value) => updateBem(index, "tipo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="imovel">Imóvel</SelectItem>
                          <SelectItem value="veiculo">Veículo</SelectItem>
                          <SelectItem value="conta_bancaria">Conta Bancária</SelectItem>
                          <SelectItem value="investimento">Investimento</SelectItem>
                          <SelectItem value="empresa">Empresa</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Valor (R$) *</Label>
                      <Input
                        id={`bem_${index}_valor`}
                        value={bem._valorDisplay ?? (bem.valor ? masks.currency(String(Math.round(bem.valor * 100))) : "")}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const display = raw === "" ? "" : masks.currency(raw);
                          const numValue = raw === "" ? 0 : Number(raw) / 100;
                          setFormData((prev) => {
                            const newBens = [...prev.bens];
                            newBens[index] = { ...newBens[index], valor: numValue, _valorDisplay: display };
                            return { ...prev, bens: newBens };
                          });
                        }}
                        placeholder="0,00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Data de Aquisição *</Label>
                      <Input
                        type="date"
                        min={formData.data_nascimento || MIN_DATE}
                        max={TODAY}
                        value={bem.data_aquisicao || ''}
                        onChange={(e) => updateBem(index, "data_aquisicao", e.target.value)}
                      />
                      <FieldError value={bem.data_aquisicao} validator="datePastOnly" />
                      <DateAfterBirthValidator date={bem.data_aquisicao} dataNascimento={formData.data_nascimento} label="Data de aquisição" />
                      <p className="text-xs text-slate-500">Define se o bem é comum ou particular</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Origem do Bem *</Label>
                      <Select
                        value={bem.origem_bem || 'onerosa'}
                        onValueChange={(value) => updateBem(index, "origem_bem", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onerosa">Compra (Onerosa)</SelectItem>
                          <SelectItem value="doacao">Doação</SelectItem>
                          <SelectItem value="heranca">Herança</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">Bens de doação/herança são particulares</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Matrícula</Label>
                      <Input
                        value={bem.identificacao || ''}
                        onChange={(e) => updateBem(index, "identificacao", e.target.value)}
                        placeholder="Nº da matrícula"
                      />
                    </div>

                    {bem.tipo === 'imovel' && (
                      <>
                        <div className="md:col-span-2">
                          <AddressInput
                            prefix={`bem_${index}`}
                            values={{
                              cep: bem.cep_imovel,
                              logradouro: bem.logradouro_imovel,
                              numero: bem.numero_imovel,
                              bairro: bem.bairro_imovel,
                              cidade: bem.municipio_bem,
                              uf: bem.uf_imovel,
                            }}
                            onChange={(field, value) => {
                              const fieldMap = {
                                cep: "cep_imovel",
                                logradouro: "logradouro_imovel",
                                numero: "numero_imovel",
                                bairro: "bairro_imovel",
                                cidade: "municipio_bem",
                                uf: "uf_imovel",
                              };
                              updateBem(index, fieldMap[field] || field, value);
                            }}
                            onAddressFound={({ logradouro, bairro, cidade, uf }) => {
                              setFormData((prev) => {
                                const newBens = [...prev.bens];
                                newBens[index] = {
                                  ...newBens[index],
                                  logradouro_imovel: logradouro,
                                  bairro_imovel: bairro,
                                  municipio_bem: cidade,
                                  uf_imovel: uf,
                                  endereco_bem: `${logradouro}, ${bairro}, ${cidade} - ${uf}`,
                                };
                                return { ...prev, bens: newBens };
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Matrícula do Imóvel</Label>
                          <Input
                            value={bem.matricula_imovel || ''}
                            onChange={(e) => updateBem(index, "matricula_imovel", e.target.value)}
                            placeholder="Nº da matrícula no cartório"
                          />
                          <p className="text-xs text-slate-500">Opcional - Número de registro no cartório</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Cartório de Registro</Label>
                          <Input
                            value={bem.cartorio_registro || ''}
                            onChange={(e) => updateBem(index, "cartorio_registro", e.target.value)}
                            placeholder="Nome do Cartório"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ofício</Label>
                          <Input
                            value={bem.oficio_cartorio || ''}
                            onChange={(e) => updateBem(index, "oficio_cartorio", e.target.value)}
                            placeholder="Ofício do cartório"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div>
                            <Label className="text-sm font-medium">Imóvel Regular</Label>
                            <p className="text-xs text-slate-500 mt-0.5">Imóveis irregulares poderão ser regularizados posteriormente</p>
                          </div>
                          <Switch
                            checked={bem.imovel_regular ?? true}
                            onCheckedChange={(checked) => updateBem(index, "imovel_regular", checked)}
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2 md:col-span-2">
                      <Label>Descrição *</Label>
                      <Textarea
                        id={`bem_${index}_descricao`}
                        value={bem.descricao || ''}
                        onChange={(e) => updateBem(index, "descricao", e.target.value)}
                        placeholder={bem.tipo === 'imovel' 
                          ? "Utilize a descrição conforme consta na Escritura do imóvel. Se não possuir, informe: tipo da construção, área construída, área total do terreno, metragem, confrontações e demais características relevantes." 
                          : "Descrição detalhada do bem"}
                        className="h-20"
                      />
                      {bem.tipo === 'imovel' && (
                        <p className="text-xs text-blue-600">
                          💡 Dica: Utilize a descrição que consta na Escritura do imóvel. Caso não possua, descreva a estrutura, metragem, confrontações e características mínimas.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={bem.observacoes || ''}
                        onChange={(e) => updateBem(index, "observacoes", e.target.value)}
                        placeholder="Observações adicionais"
                        className="h-16"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Documento Comprobatório (Matrícula, CRLV, Extrato, etc.)</Label>
                      <FileUpload
                        value={bem.documento_url || ""}
                        onChange={(url) => updateBem(index, "documento_url", url)}
                        label="Anexar Documento do Bem"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {formData.bens.length > 0 && (
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Patrimônio Total</p>
                <p className="text-3xl font-bold text-emerald-600">
                  R$ {totalPatrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}