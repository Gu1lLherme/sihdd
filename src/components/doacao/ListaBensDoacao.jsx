import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Trash2, Upload } from "lucide-react";
import { masks } from "@/components/Masks";

export default function ListaBensDoacao({ bens, onAddBem, onRemoveBem }) {
  const [novoBem, setNovoBem] = useState({
    tipo: "casa",
    descricao: "",
    valor: "",
    identificacao: "",
    documento_url: ""
  });

  const handleAdd = () => {
    if (!novoBem.descricao || !novoBem.valor) return;
    onAddBem({ ...novoBem, valor: masks.currencyToNumber(novoBem.valor) });
    setNovoBem({
      tipo: "casa",
      descricao: "",
      valor: "",
      identificacao: "",
      documento_url: ""
    });
  };

  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5 text-amber-500" />
          Bens Doados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form to Add Bem */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label>Tipo do Bem</Label>
                    <Select 
                        value={novoBem.tipo} 
                        onValueChange={(val) => setNovoBem({...novoBem, tipo: val})}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="casa">Casa</SelectItem>
                            <SelectItem value="terreno">Terreno</SelectItem>
                            <SelectItem value="carro">Carro</SelectItem>
                            <SelectItem value="creditos_titulos">Créditos e Títulos</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <Label>Descrição</Label>
                    <Input 
                        value={novoBem.descricao}
                        onChange={(e) => setNovoBem({...novoBem, descricao: e.target.value})}
                        placeholder="Ex: Imóvel na Rua X..."
                    />
                </div>
                <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input 
                        value={novoBem.valor}
                        onChange={(e) => setNovoBem({...novoBem, valor: masks.currency(e.target.value)})}
                        placeholder="0,00"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Identificação (Matrícula/Placa)</Label>
                    <Input 
                        value={novoBem.identificacao}
                        onChange={(e) => setNovoBem({...novoBem, identificacao: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Anexo (Documento/Matrícula)</Label>
                    <div className="flex gap-2">
                        <Button variant="outline" className="w-full" onClick={() => alert("Simulação de Upload: Documento anexado!")}>
                            <Upload className="w-4 h-4 mr-2" />
                            Anexar Documento
                        </Button>
                    </div>
                </div>
            </div>
            <Button onClick={handleAdd} className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Bem
            </Button>
        </div>

        {/* List of Bens */}
        <div className="space-y-2">
            {bens.map((bem, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                    <div>
                        <p className="font-bold text-gray-800">{bem.descricao}</p>
                        <p className="text-sm text-gray-500">
                            {bem.tipo.toUpperCase()} - {masks.currency(bem.valor * 100)} - Doc: {bem.documento_url ? "Anexado" : "Pendente"}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onRemoveBem(idx)} className="text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
            {bens.length === 0 && (
                <p className="text-center text-gray-400 py-4">Nenhum bem adicionado.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}