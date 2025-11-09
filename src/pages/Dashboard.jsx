import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, FileText, AlertCircle, Clock, CheckCircle2, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import CasoCard from "../components/dashboard/CasoCard";
import StatsOverview from "../components/dashboard/StatsOverview";

export default function Dashboard() {
  const { data: casos, isLoading } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list('-created_date'),
    initialData: [],
  });

  const stats = {
    total: casos.length,
    emAnalise: casos.filter(c => c.status === 'em_analise').length,
    aguardandoPagamento: casos.filter(c => c.status === 'aguardando_pagamento').length,
    concluidos: casos.filter(c => c.status === 'concluido').length,
    valorTotal: casos.reduce((sum, c) => sum + (c.patrimonio_total || 0), 0),
    itcmdTotal: casos.reduce((sum, c) => sum + (c.itcmd_total || 0), 0),
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Painel de Casos</h1>
            <p className="text-slate-600">Gerencie todos os inventários em um só lugar</p>
          </div>
          <Link to={createPageUrl("NovoCaso")}>
            <Button className="bg-blue-900 hover:bg-blue-800 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Novo Caso
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Lista de Casos */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-blue-900" />
            <h2 className="text-xl font-bold text-slate-900">Casos Ativos</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
              <p className="text-slate-500 mt-4">Carregando casos...</p>
            </div>
          ) : casos.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">Nenhum caso cadastrado ainda</p>
              <Link to={createPageUrl("NovoCaso")}>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Caso
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {casos.map((caso) => (
                <CasoCard key={caso.id} caso={caso} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}