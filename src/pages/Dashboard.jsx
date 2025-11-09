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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-[#F5F7FA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header - Azul Royal */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#4169E1] to-[#5a7bea] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A237E] leading-tight">
                  Dashboard Inteligente
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#6B7280] mt-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFD700]" />
                  Automação Jurídica e Tributária
                </p>
              </div>
            </div>
            <Link to={createPageUrl("NovoCaso")} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-[#4169E1] to-[#FFD700] hover:from-[#5a7bea] hover:to-[#ffd700] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-11 sm:h-12 px-6 sm:px-8 font-bold text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Novo Inventário
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Dourado para KPIs Importantes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <StatsCards 
            title="Total de Casos" 
            value={totalCasos}
            icon={FileText}
            gradient="from-[#4169E1] to-[#5a7bea]"
            iconBg="bg-blue-100"
            iconColor="text-[#4169E1]"
            isGold={false}
          />
          <StatsCards 
            title="Casos Ativos" 
            value={casosAtivos}
            icon={Clock}
            gradient="from-[#4169E1] to-[#5a7bea]"
            iconBg="bg-blue-100"
            iconColor="text-[#4169E1]"
            isGold={false}
          />
          <StatsCards 
            title="Patrimônio Total" 
            value={`R$ ${(totalPatrimonio / 1000).toFixed(0)}k`}
            icon={DollarSign}
            gradient="from-[#FFD700] to-[#FFC107]"
            iconBg="bg-amber-100"
            iconColor="text-[#FFD700]"
            isGold={true}
          />
          <StatsCards 
            title="ITCMD Total" 
            value={`R$ ${(totalITCMD / 1000).toFixed(0)}k`}
            icon={TrendingUp}
            gradient="from-[#FFD700] to-[#FFC107]"
            iconBg="bg-amber-100"
            iconColor="text-[#FFD700]"
            isGold={true}
          />
        </div>

        {/* Ações Rápidas - Azul Royal */}
        <div className="glassmorphism border-2 border-[#4169E1]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 lg:mb-10 card-shadow-hover">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4169E1] to-[#FFD700] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#1A237E]">Ações Rápidas Inteligentes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link to={createPageUrl("ChatAssistente")}>
              <Button className="w-full h-auto py-3 sm:py-4 bg-gradient-to-r from-[#4169E1] to-[#5a7bea] hover:from-[#5a7bea] hover:to-[#4169E1] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-bold text-sm sm:text-base">Consultar IA RAG</span>
                  <span className="text-[10px] sm:text-xs opacity-90">Legislação ITCMD/SE</span>
                </div>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Integracoes")}>
              <Button className="w-full h-auto py-3 sm:py-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#10B981] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-bold text-sm sm:text-base">Gerar Certidão</span>
                  <span className="text-[10px] sm:text-xs opacity-90">SEFAZ/SE Automático</span>
                </div>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Relatorios")} className="sm:col-span-2 lg:col-span-1">
              <Button className="w-full h-auto py-3 sm:py-4 bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4169E1] to-[#FFD700] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1A237E]">Analytics e Tendências</h2>
            </div>
            <DashboardCharts casos={casos} />
          </div>
        )}

        {/* Casos Recentes */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4169E1] to-[#5a7bea] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1A237E]">Inventários Recentes</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 sm:h-64 glassmorphism rounded-xl sm:rounded-2xl animate-pulse card-shadow" />
              ))}
            </div>
          ) : casos.length === 0 ? (
            <div className="glassmorphism rounded-xl sm:rounded-2xl card-shadow p-8 sm:p-12 text-center border-2 border-[#4169E1]/20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A237E] mb-2">
                Nenhum caso cadastrado
              </h3>
              <p className="text-sm sm:text-base text-[#6B7280] mb-4 sm:mb-6">
                Comece criando seu primeiro inventário inteligente
              </p>
              <Link to={createPageUrl("NovoCaso")}>
                <Button className="bg-gradient-to-r from-[#4169E1] to-[#FFD700] hover:from-[#5a7bea] hover:to-[#ffd700] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold">
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

        {/* Todos os Casos - Table Hidden on Mobile */}
        {casos.length > 0 && (
          <div className="hidden md:block">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1A237E] to-[#4169E1] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1A237E]">Todos os Inventários</h2>
            </div>
            <CasosTable casos={casos} />
          </div>
        )}
      </div>
    </div>
  );
}