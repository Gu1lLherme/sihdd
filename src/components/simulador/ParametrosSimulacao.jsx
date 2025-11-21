import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { masks } from "@/components/Masks";

export default function ParametrosSimulacao({ 
  valorPatrimonio, 
  setValorPatrimonio, 
  estado, 
  setEstado, 
  numHerdeiros, 
  setNumHerdeiros, 
  estados 
}) {
  return (
    <Card className="border-2 border-[#FFC107] mb-6">
      <CardHeader className="bg-amber-50 border-b-2 border-[#FFC107]">
        <CardTitle className="text-[#333333]">Parâmetros da Simulação</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="valor">Valor Total do Patrimônio</Label>
            <Input
              id="valor"
              type="text"
              value={masks.currency(valorPatrimonio)}
              onChange={(e) => setValorPatrimonio(Number(e.target.value.replace(/\D/g, "")) / 100)}
              className="text-lg font-bold"
            />
          </div>
          <div>
            <Label htmlFor="estado">Estado/Região</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(estados).map(([uf, info]) => (
                  <SelectItem key={uf} value={uf}>
                    {info.nome} (ITCMD {info.aliquota_itcmd}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="herdeiros">Número de Herdeiros</Label>
            <Input
              id="herdeiros"
              type="number"
              value={numHerdeiros}
              onChange={(e) => setNumHerdeiros(Number(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}