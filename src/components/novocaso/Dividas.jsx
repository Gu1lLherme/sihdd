import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, TrendingDown } from "lucide-react";
import { masks } from "@/components/Masks";
import { FieldError } from "@/components/validations";
import DateAfterBirthValidator from "@/components/novocaso/DateAfterBirthValidator";

const TODAY = new Date().toISOString().split('T')[0];
const MIN_DATE = "1600-01-01";

export default function Dividas({ formData, setFormData }) {
  const [novaDivida, setNovaDivida] = useState({
    identificacao: "",
    credor: "",
    valor: "",
    data_vencimento: "",
    juros: "",
    prazo_prescricional: "",
    status: "pendente"
  });

  const dividas = formData.dividas || [];
  const totalDividas = dividas.reduce((sum, d) => sum + (Number(d.valor) || 0), 0);

  const handleAddDivida = () => {
    if (!novaDivida.credor || !novaDivida.valor) {
      alert("Preencha ao menos o credor e o valor da dívida");
      return;
    }

    const nextNumber = dividas.length + 1;

    const dividaComValorNumerico = {
      ...novaDivida,
      numero: nextNumber,
      titulo: novaDivida.credor,
      valor: masks.currencyToNumber(novaDivida.valor)
    };

    setFormData((prev) => ({
      ...prev,
      dividas: [...(prev.dividas || []), dividaComValorNumerico]
    }));
    setNovaDivida({
      identificacao: "",
      credor: "",
      valor: "",
      data_vencimento: "",
      juros: "",
      prazo_prescricional: "",
      status: "pendente"
    });
  };

  const handleRemoveDivida = (index) => {
    setFormData((prev) => ({
      ...prev,
      dividas: prev.dividas.filter((_, i) => i !== index).map((d, i) => ({ ...d, numero: i + 1 })),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-red-500 pl-4 mb-6">
        <h3 className="font-semibold text-lg text-slate-900">Dívidas do Espólio</h3>
        <p className="text-sm text-slate-600">Cadastre as dívidas deixadas pelo falecido</p>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Identificação / Descrição / Natureza</Label>
              <Textarea
                value={novaDivida.identificacao}
                onChange={(e) => setNovaDivida({...novaDivida, identificacao: e.target.value})}
                placeholder="Ex: Empréstimo consignado, Dívida de cartão, Financiamento imobiliário..."
                className="h-16"
              />
            </div>
            <div className="space-y-2">
              <Label>Credor *</Label>
              <Input
                value={novaDivida.credor}
                onChange={(e) => setNovaDivida({...novaDivida, credor: e.target.value})}
                placeholder="Nome do credor"
              />
            </div>
            <div className="space-y-2">
              <Label>Valor (R$) *</Label>
              <Input
                value={novaDivida.valor}
                onChange={(e) => setNovaDivida({...novaDivida, valor: masks.currency(e.target.value)})}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label>Data Vencimento</Label>
              <Input
                type="date"
                min={formData.data_nascimento || MIN_DATE}
                value={novaDivida.data_vencimento}
                onChange={(e) => setNovaDivida({...novaDivida, data_vencimento: e.target.value})}
              />
              <FieldError value={novaDivida.data_vencimento} validator="datePastOnly" />
              <DateAfterBirthValidator date={novaDivida.data_vencimento} dataNascimento={formData.data_nascimento} label="Data de vencimento" />
            </div>
            <div className="space-y-2">
              <Label>Juros</Label>
              <Input
                value={novaDivida.juros}
                onChange={(e) => setNovaDivida({...novaDivida, juros: e.target.value})}
                placeholder="Ex: 1,5% a.m., SELIC + 2%..."
              />
            </div>
            <div className="space-y-2">
              <Label>Prazo Prescricional</Label>
              <Input
                value={novaDivida.prazo_prescricional}
                onChange={(e) => setNovaDivida({...novaDivida, prazo_prescricional: e.target.value})}
                placeholder="Ex: 5 anos, 3 anos..."
              />
            </div>
          </div>
          <Button onClick={handleAddDivida} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Dívida
          </Button>
        </CardContent>
      </Card>

      {dividas.length > 0 && (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="w-[60px] text-center">Nº</TableHead>
                  <TableHead>Identificação / Natureza</TableHead>
                  <TableHead>Credor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Juros</TableHead>
                  <TableHead>Prazo Presc.</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dividas.map((divida, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center font-bold text-slate-500">{divida.numero || idx + 1}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate" title={divida.identificacao}>{divida.identificacao || '-'}</TableCell>
                    <TableCell className="font-medium">{divida.credor || divida.titulo || '-'}</TableCell>
                    <TableCell className="font-semibold text-red-600 whitespace-nowrap">
                      {Number(divida.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{divida.data_vencimento ? masks.date(divida.data_vencimento.split('-').reverse().join('')) : '-'}</TableCell>
                    <TableCell>{divida.juros || '-'}</TableCell>
                    <TableCell>{divida.prazo_prescricional || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveDivida(idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total de Dívidas ({dividas.length})</p>
                  <p className="text-3xl font-bold text-red-600">
                    R$ {totalDividas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}