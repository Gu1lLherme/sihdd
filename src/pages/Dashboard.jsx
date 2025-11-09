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
    <div className="p-4 md:p-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header com IA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B1A2E]">
                Dashboard Inteligente
              </h1>
              <p className="text-[#6B7280] text-lg mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                Automação Jurídica e Tributária
              </p>
            </div>
          </div>
          <Link to={createPageUrl("NovoCaso")} className="w-full md:w-auto">
            <Button className="w-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-12 px-8 font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Novo Inventário
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
            title="Patrimônio Total" 
            value={`R$ ${totalPatrimonio.toLocaleString('pt-BR')}`}
            icon={TrendingUp}
            gradient="from-[#10B981] to-[#059669]"
            iconBg="bg-emerald-100"
            iconColor="text-[#10B981]"
          />
          <StatsCards 
            title="ITCMD Total" 
            value={`R$ ${totalITCMD.toLocaleString('pt-BR')}`}
            icon={AlertCircle}
            gradient="from-purple-500 to-purple-600"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* Ações Rápidas com IA */}
        <div className="glassmorphism border border-slate-200 rounded-2xl p-6 mb-10 card-shadow-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Ações Rápidas Inteligentes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to={createPageUrl("ChatAssistente")}>
              <Button className="w-full h-auto py-4 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <Brain className="w-6 h-6" />
                  <span className="font-semibold">Consultar IA RAG</span>
                  <span className="text-xs opacity-90">Legislação ITCMD/SE</span>
                </div>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Integracoes")}>
              <Button className="w-full h-auto py-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#10B981] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-semibold">Gerar Certidão</span>
                  <span className="text-xs opacity-90">SEFAZ/SE Automático</span>
                </div>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Relatorios")}>
              <Button className="w-full h-auto py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#F59E0B] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">Relatório Financeiro</span>
                  <span className="text-xs opacity-90">Analytics Completo</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Gráficos Analytics */}
        {casos.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B1A2E]">Analytics e Tendências</h2>
            </div>
            <DashboardCharts casos={casos} />
          </div>
        )}

        {/* Casos Recentes */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#0B1A2E]">Inventários Recentes</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 glassmorphism rounded-2xl animate-pulse card-shadow" />
              ))}
            </div>
          ) : casos.length === 0 ? (
            <div className="glassmorphism rounded-2xl card-shadow p-12 text-center border border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">
                Nenhum caso cadastrado
              </h3>
              <p className="text-[#6B7280] mb-6">
                Comece criando seu primeiro inventário inteligente
              </p>
              <Link to={createPageUrl("NovoCaso")}>
                <Button className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#1E40AF] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Inventário
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0B1A2E]">Todos os Inventários</h2>
            </div>
            <CasosTable casos={casos} />
          </div>
        )}
      </div>
    </div>
  );
}