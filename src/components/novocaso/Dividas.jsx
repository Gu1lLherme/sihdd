import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, DollarSign } from "lucide-react";
import { masks } from "@/components/Masks";
import { FieldError } from "@/components/validations";
import DateAfterBirthValidator from "@/components/novocaso/DateAfterBirthValidator";

const TODAY = new Date().toISOString().split('T')[0];
const MIN_DATE = "1600-01-01";

export default function Dividas({ formData, setFormData }) {
  const [novaDivida, setNovaDivida] = useState({
    titulo: "",
    descricao: "",
    valor: "",
    data_vencimento: "",
    status: "pendente"
  });

  const handleAddDivida = () => {
    if (!novaDivida.titulo || !novaDivida.valor) {
      alert("Preencha título e valor da dívida");
      return;
    }

    const dividaComValorNumerico = {
      ...novaDivida,
      valor: masks.currencyToNumber(novaDivida.valor)
    };

    setFormData((prev) => ({
      ...prev,
      dividas: [...(prev.dividas || []), dividaComValorNumerico]
    }));
    setNovaDivida({
      titulo: "",
      descricao: "",
      valor: "",
      data_vencimento: "",
      status: "pendente"
    });
  };

  const handleRemoveDivida = (index) => {
    setFormData((prev) => ({
      ...prev,
      dividas: prev.dividas.filter((_, i) => i !== index),
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
            <div className="space-y-2">
              <Label>Credor / Título *</Label>
              <Input
                value={novaDivida.titulo}
                onChange={(e) => setNovaDivida({...novaDivida, titulo: e.target.value})}
                placeholder="Ex: Cartão de Crédito, Empréstimo..."
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
              <Label>Descrição</Label>
              <Input
                value={novaDivida.descricao}
                onChange={(e) => setNovaDivida({...novaDivida, descricao: e.target.value})}
                placeholder="Detalhes adicionais..."
              />
            </div>
          </div>
          <Button onClick={handleAddDivida} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Dívida
          </Button>
        </CardContent>
      </Card>

      {(formData.dividas || []).length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.dividas.map((divida, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{divida.titulo}</TableCell>
                  <TableCell>{divida.data_vencimento ? masks.date(divida.data_vencimento.split('-').reverse().join('')) : '-'}</TableCell>
                  <TableCell>{Number(divida.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
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
      )}
    </div>
  );
}