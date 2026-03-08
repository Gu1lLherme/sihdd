import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Home, Car, Wallet, TrendingUp, Building2, Package } from "lucide-react";
import { masks } from "@/components/Masks";

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
    setFormData({
      ...formData,
      bens: [
        ...formData.bens,
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
    });
  };

  const removeBem = (index) => {
    setFormData({
      ...formData,
      bens: formData.bens.filter((_, i) => i !== index),
    });
  };

  const updateBem = (index, field, value) => {
    const newBens = [...formData.bens];
    newBens[index] = { ...newBens[index], [field]: value };
    setFormData({ ...formData, bens: newBens });
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
                        value={masks.currency(bem.valor * 100)}
                        onChange={(e) => updateBem(index, "valor", masks.currencyToNumber(e.target.value))}
                        placeholder="0,00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Data de Aquisição *</Label>
                      <Input
                        type="date"
                        value={bem.data_aquisicao || ''}
                        onChange={(e) => updateBem(index, "data_aquisicao", e.target.value)}
                      />
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
                      <Label>Identificação</Label>
                      <Input
                        value={bem.identificacao || ''}
                        onChange={(e) => updateBem(index, "identificacao", e.target.value)}
                        placeholder="Matrícula, placa, número da conta..."
                      />
                    </div>

                    {bem.tipo === 'imovel' && (
                      <>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Endereço do Imóvel</Label>
                          <Input
                            value={bem.endereco || ''}
                            onChange={(e) => updateBem(index, "endereco", e.target.value)}
                            placeholder="Rua, Número, Bairro, Cidade - UF"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Cartório de Registro</Label>
                          <Input
                            value={bem.cartorio || ''}
                            onChange={(e) => updateBem(index, "cartorio", e.target.value)}
                            placeholder="Nome do Cartório e Comarca"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2 md:col-span-2">
                      <Label>Descrição *</Label>
                      <Textarea
                        value={bem.descricao || ''}
                        onChange={(e) => updateBem(index, "descricao", e.target.value)}
                        placeholder="Descrição detalhada do bem"
                        className="h-20"
                      />
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