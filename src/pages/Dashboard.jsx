import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Brain, FileText, Sparkles, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header com IA - Mobile First */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1A2E] leading-tight">
                  Dashboard Inteligente
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#6B7280] mt-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#F59E0B]" />
                  Automação Jurídica
                </p>
              </div>
            </div>
            <Link to={createPageUrl("NovoCaso")} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-11 sm:h-12 px-6 sm:px-8 font-semibold text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Novo Inventário
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <StatsCards 
            title="Total de Casos" 
            value={totalCasos}
            icon={FileText}
            gradient="from-[#1E40AF] to-[#3B82F6]"
            iconBg="bg-blue-100"
            iconColor="text-[#1E40AF]"
          />
          <StatsCards 
            title="Casos Ativos" 
            value={casosAtivos}
            icon={Clock}
            gradient="from-[#F59E0B] to-[#D97706]"
            iconBg="bg-amber-100"
            iconColor="text-[#F59E0B]"
          />
          <StatsCards 
            title="Patrimônio" 
            value={`R$ ${(totalPatrimonio / 1000).toFixed(0)}k`}
            icon={TrendingUp}
            gradient="from-[#10B981] to-[#059669]"
            iconBg="bg-emerald-100"
            iconColor="text-[#10B981]"
          />
          <StatsCards 
            title="ITCMD Total" 
            value={`R$ ${(totalITCMD / 1000).toFixed(0)}k`}
            icon={AlertCircle}
            gradient="from-purple-500 to-purple-600"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* Ações Rápidas com IA - Mobile Optimized */}
        <div className="glassmorphism border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 lg:mb-10 card-shadow-hover">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-lg sm:rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#111827]">Ações Rápidas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link to={createPageUrl("ChatAssistente")}>
              <Button className="w-full h-auto py-3 sm:py-4 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-semibold text-sm sm:text-base">Consultar IA RAG</span>
                  <span className="text-[10px] sm:text-xs opacity-90">Legislação ITCMD/SE</span>
                </div>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Integracoes")}>
              <Button className="w-full h-auto py-3 sm:py-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#10B981] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-semibold text-sm sm:text-base">Gerar Certidão</span>
                  <span className="text-[10px] sm:text-xs opacity-90">SEFAZ/SE</span>
                </div>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Relatorios")} className="sm:col-span-2 lg:col-span-1">
              <Button className="w-full h-auto py-3 sm:py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#F59E0B] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-semibold text-sm sm:text-base">Relatório Financeiro</span>
                  <span className="text-[10px] sm:text-xs opacity-90">Analytics Completo</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Gráficos Analytics - Hidden on Mobile */}
        {casos.length > 0 && (
          <div className="mb-6 sm:mb-8 lg:mb-10 hidden sm:block">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B1A2E]">Analytics</h2>
            </div>
            <DashboardCharts casos={casos} />
          </div>
        )}

        {/* Casos Recentes - Mobile Grid */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-lg sm:rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B1A2E]">Inventários Recentes</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 sm:h-64 glassmorphism rounded-xl sm:rounded-2xl animate-pulse card-shadow" />
              ))}
            </div>
          ) : casos.length === 0 ? (
            <div className="glassmorphism rounded-xl sm:rounded-2xl card-shadow p-8 sm:p-12 text-center border border-slate-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#111827] mb-2">
                Nenhum caso cadastrado
              </h3>
              <p className="text-sm sm:text-base text-[#6B7280] mb-4 sm:mb-6">
                Comece criando seu primeiro inventário
              </p>
              <Link to={createPageUrl("NovoCaso")}>
                <Button className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B1A2E]">Todos os Inventários</h2>
            </div>
            <CasosTable casos={casos} />
          </div>
        )}
      </div>
    </div>
  );
}