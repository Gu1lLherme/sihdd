import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, TrendingUp, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

import CasoCard from "../components/dashboard/CasoCard";
import StatsCards from "../components/dashboard/StatsCards";
import CasosTable from "../components/dashboard/CasosTable";
import DashboardCharts from "../components/dashboard/DashboardCharts";

export default function Dashboard() {
  const { data: casos, isLoading } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list("-created_date"),
    initialData: [],
  });

  const totalCasos = casos.length;
  const casosAtivos = casos.filter(c => c.status !== 'finalizado').length;
  const totalPatrimonio = casos.reduce((sum, c) => sum + (c.valor_patrimonio || 0), 0);
  const totalITCMD = casos.reduce((sum, c) => sum + (c.valor_itcmd || 0), 0);

  const casosRecentes = casos.slice(0, 4);

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header com animação */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 bg-clip-text text-transparent">
                  Gerencie todos os inventários
                </h1>
                <p className="text-slate-600 text-lg">em um só lugar</p>
              </div>
            </div>
          </div>
          <Link to={createPageUrl("NovoCaso")} className="w-full md:w-auto">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-12 px-6">
              <Plus className="w-5 h-5 mr-2" />
              Novo Caso
            </Button>
          </Link>
        </div>

        {/* Stats Cards com Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="group">
            <StatsCards 
              title="Total de Casos" 
              value={totalCasos}
              icon={CheckCircle2}
              gradient="from-blue-500 to-blue-600"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
          </div>
          <div className="group">
            <StatsCards 
              title="Casos Ativos" 
              value={casosAtivos}
              icon={Clock}
              gradient="from-amber-500 to-amber-600"
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
          </div>
          <div className="group">
            <StatsCards 
              title="Patrimônio Total" 
              value={`R$ ${totalPatrimonio.toLocaleString('pt-BR')}`}
              icon={TrendingUp}
              gradient="from-emerald-500 to-emerald-600"
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
          </div>
          <div className="group">
            <StatsCards 
              title="ITCMD Total" 
              value={`R$ ${totalITCMD.toLocaleString('pt-BR')}`}
              icon={AlertCircle}
              gradient="from-purple-500 to-purple-600"
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>
        </div>

        {/* Gráficos */}
        {casos.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Análise e Tendências
            </h2>
            <DashboardCharts casos={casos} />
          </div>
        )}

        {/* Casos Recentes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Casos Recentes</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-white rounded-2xl animate-pulse shadow-lg" />
              ))}
            </div>
          ) : casos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Nenhum caso cadastrado
              </h3>
              <p className="text-slate-500 mb-6">
                Comece criando seu primeiro caso de inventário
              </p>
              <Link to={createPageUrl("NovoCaso")}>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Caso
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {casosRecentes.map((caso) => (
                <CasoCard key={caso.id} caso={caso} />
              ))}
            </div>
          )}
        </div>

        {/* Todos os Casos */}
        {casos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Todos os Casos</h2>
            <CasosTable casos={casos} />
          </div>
        )}
      </div>
    </div>
  );
}