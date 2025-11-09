import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Brain, FileText, Sparkles, TrendingUp, Clock, CheckCircle2, AlertCircle, DollarSign } from "lucide-react";

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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header - Azul Royal */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#4169E1] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#333333] leading-tight">
                  Dashboard Inteligente
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#AAAAAA] mt-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFC107]" />
                  Automação Jurídica e Tributária
                </p>
              </div>
            </div>
            <Link to={createPageUrl("NovoCaso")} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#4169E1] hover:bg-[#3151c7] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-11 sm:h-12 px-6 sm:px-8 font-bold text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Novo Inventário
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <StatsCards 
            title="Total de Casos" 
            value={totalCasos}
            icon={FileText}
            color="#4169E1"
            isPremium={false}
          />
          <StatsCards 
            title="Casos Ativos" 
            value={casosAtivos}
            icon={Clock}
            color="#4169E1"
            isPremium={false}
          />
          <StatsCards 
            title="Patrimônio" 
            value={`R$ ${(totalPatrimonio / 1000).toFixed(0)}k`}
            icon={DollarSign}
            color="#FFC107"
            isPremium={true}
          />
          <StatsCards 
            title="ITCMD Total" 
            value={`R$ ${(totalITCMD / 1000).toFixed(0)}k`}
            icon={TrendingUp}
            color="#FFC107"
            isPremium={true}
          />
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 lg:mb-10 card-shadow-hover">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4169E1] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#333333]">Ações Rápidas Inteligentes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link to={createPageUrl("ChatAssistente")}>
              <Button className="w-full h-auto py-3 sm:py-4 bg-[#4169E1] hover:bg-[#3151c7] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-bold text-sm sm:text-base">Consultar IA RAG</span>
                  <span className="text-[10px] sm:text-xs opacity-90">Legislação ITCMD/SE</span>
                </div>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Integracoes")}>
              <Button className="w-full h-auto py-3 sm:py-4 bg-[#28A745] hover:bg-[#218838] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-bold text-sm sm:text-base">Gerar Certidão</span>
                  <span className="text-[10px] sm:text-xs opacity-90">SEFAZ/SE Automático</span>
                </div>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Relatorios")} className="sm:col-span-2 lg:col-span-1">
              <Button className="w-full h-auto py-3 sm:py-4 bg-[#FFC107] hover:bg-[#e6ac00] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-bold text-sm sm:text-base">Relatório Financeiro</span>
                  <span className="text-[10px] sm:text-xs opacity-90">Analytics Premium</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Gráficos Analytics */}
        {casos.length > 0 && (
          <div className="mb-6 sm:mb-8 lg:mb-10 hidden sm:block">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4169E1] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#333333]">Analytics e Tendências</h2>
            </div>
            <DashboardCharts casos={casos} />
          </div>
        )}

        {/* Casos Recentes */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4169E1] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#333333]">Inventários Recentes</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 sm:h-64 bg-[#F5F5F5] rounded-xl sm:rounded-2xl animate-pulse card-shadow" />
              ))}
            </div>
          ) : casos.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl card-shadow p-8 sm:p-12 text-center border-2 border-slate-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#AAAAAA]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#333333] mb-2">
                Nenhum caso cadastrado
              </h3>
              <p className="text-sm sm:text-base text-[#AAAAAA] mb-4 sm:mb-6">
                Comece criando seu primeiro inventário inteligente
              </p>
              <Link to={createPageUrl("NovoCaso")}>
                <Button className="bg-[#4169E1] hover:bg-[#3151c7] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Inventário
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {casosRecentes.map((caso) => (
                <CasoCard key={caso.id} caso={caso} />
              ))}
            </div>
          )}
        </div>

        {/* Todos os Casos */}
        {casos.length > 0 && (
          <div className="hidden md:block">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4169E1] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#333333]">Todos os Inventários</h2>
            </div>
            <CasosTable casos={casos} />
          </div>
        )}
      </div>
    </div>
  );
}