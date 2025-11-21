import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Car, TrendingUp, Building2 } from "lucide-react";

export default function FiltrosBens({ tipoFiltro, setTipoFiltro }) {
  return (
    <Card className="border-2 border-slate-200 mb-6">
      <CardHeader className="bg-slate-50 border-b-2 border-slate-200">
        <CardTitle className="text-[#333333]">Filtrar por Tipo</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={tipoFiltro === "all" ? "default" : "outline"}
            onClick={() => setTipoFiltro("all")}
            className={tipoFiltro === "all" ? "bg-[#4169E1]" : ""}
          >
            Todos os Bens
          </Button>
          <Button
            variant={tipoFiltro === "imovel" ? "default" : "outline"}
            onClick={() => setTipoFiltro("imovel")}
            className={tipoFiltro === "imovel" ? "bg-[#4169E1]" : ""}
          >
            <Home className="w-4 h-4 mr-2" />
            Imóveis
          </Button>
          <Button
            variant={tipoFiltro === "veiculo" ? "default" : "outline"}
            onClick={() => setTipoFiltro("veiculo")}
            className={tipoFiltro === "veiculo" ? "bg-[#4169E1]" : ""}
          >
            <Car className="w-4 h-4 mr-2" />
            Veículos
          </Button>
          <Button
            variant={tipoFiltro === "investimento" ? "default" : "outline"}
            onClick={() => setTipoFiltro("investimento")}
            className={tipoFiltro === "investimento" ? "bg-[#4169E1]" : ""}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Investimentos
          </Button>
          <Button
            variant={tipoFiltro === "empresa" ? "default" : "outline"}
            onClick={() => setTipoFiltro("empresa")}
            className={tipoFiltro === "empresa" ? "bg-[#4169E1]" : ""}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Empresas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}