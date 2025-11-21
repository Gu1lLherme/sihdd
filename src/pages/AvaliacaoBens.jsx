import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Home, Car, Building2 } from "lucide-react";

// Imported components
import FiltrosBens from "@/components/avaliacao/FiltrosBens";
import ListaBens from "@/components/avaliacao/ListaBens";

const TIPO_ICONS = {
  imovel: Home,
  veiculo: Car,
  investimento: TrendingUp,
  empresa: Building2,
  conta_bancaria: Building2, // Assuming
  outros: Building2 // Assuming
};

export default function AvaliacaoBens() {
  const queryClient = useQueryClient();
  const [tipoFiltro, setTipoFiltro] = useState("all");
  const [expandedBem, setExpandedBem] = useState(null);

  const { data: bens, isLoading } = useQuery({
    queryKey: ['bens'],
    queryFn: () => base44.entities.Bem.list("-created_date"),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Bem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bens'] });
    },
  });

  const bensFiltrados = tipoFiltro === "all" 
    ? bens 
    : bens.filter(b => b.tipo === tipoFiltro);

  const totalValor = bensFiltrados.reduce((sum, b) => sum + (b.valor || 0), 0);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFC107] to-[#e6ac00] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Avaliação e Precificação de Bens</h1>
              <p className="text-amber-100 text-sm">Gerencie e avalie os bens do espólio</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <Card className="border-2 border-[#FFC107] mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#AAAAAA] font-bold uppercase mb-1">Valor Total dos Bens</p>
                <p className="text-3xl font-extrabold text-[#FFC107]">
                  R$ {totalValor.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#AAAAAA] font-bold uppercase mb-1">Total de Bens</p>
                <p className="text-3xl font-extrabold text-[#4169E1]">{bensFiltrados.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <FiltrosBens 
          tipoFiltro={tipoFiltro}
          setTipoFiltro={setTipoFiltro}
        />

        <ListaBens 
          bens={bensFiltrados}
          expandedBem={expandedBem}
          setExpandedBem={setExpandedBem}
          TIPO_ICONS={TIPO_ICONS}
          Home={Home}
        />
      </div>
    </div>
  );
}