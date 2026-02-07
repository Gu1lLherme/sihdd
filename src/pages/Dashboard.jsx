import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Building, 
  Calculator, 
  Gavel, 
  Calendar, 
  Plus, 
  Download
} from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

import StatsCardNew from "../components/dashboard/StatsCardNew";
import IAWidget from "../components/dashboard/IAWidget";
import ModelagemWidget from "../components/dashboard/ModelagemWidget";
import PendingTasksWidget from "../components/dashboard/PendingTasksWidget";
import RecentActivityTable from "../components/dashboard/RecentActivityTable";

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const { data: casos = [] } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list("-created_date"),
    initialData: [],
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list("-created_date"),
    initialData: [],
  });

  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await base44.entities.Task.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tarefa atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar tarefa.");
    }
  });

  const handleTaskToggle = (task) => {
    const newStatus = task.status === 'concluida' ? 'pendente' : 'concluida';
    updateTaskMutation.mutate({ id: task.id, status: newStatus });
  };

  const handleExportReport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Relatório Geral do Escritório", 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text(`Patrimônio sob Gestão: R$ ${(totalPatrimonio || 0).toLocaleString('pt-BR')}`, 20, 40);
      doc.text(`ITCMD Calculado: R$ ${(totalITCMD || 0).toLocaleString('pt-BR')}`, 20, 50);
      doc.text(`Processos Ativos: ${processosAtivos}`, 20, 60);
      
      doc.text("Últimos Casos:", 20, 80);
      let y = 90;
      casos.slice(0, 5).forEach((caso) => {
        doc.text(`- ${caso.nome_falecido} (${caso.status})`, 20, y);
        y += 10;
      });
      
      doc.save("relatorio-geral.pdf");
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar relatório.");
    }
  };

  // Calculate stats
  const totalPatrimonio = casos.reduce((sum, c) => sum + (c.valor_patrimonio || 0), 0);
  const totalITCMD = casos.reduce((sum, c) => sum + (c.valor_itcmd || 0), 0);
  const processosAtivos = casos.filter(c => c.status !== 'finalizado').length;
  
  // Calculate critical deadlines (tasks due in next 3 days or overdue)
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  const prazosCriticos = tasks.filter(t => {
    if (t.status === 'concluida' || t.status === 'cancelada' || !t.data_vencimento) return false;
    const dueDate = new Date(t.data_vencimento);
    return dueDate <= threeDaysFromNow;
  }).length;

  // Generate Chart Data from real Casos
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d;
  }).reverse();

  const chartData = last6Months.map(date => {
    const monthName = date.toLocaleString('pt-BR', { month: 'short' });
    const monthKey = date.getMonth();
    const yearKey = date.getFullYear();
    
    // Filter cases created in this month/year
    const casesInMonth = casos.filter(c => {
      const cDate = new Date(c.created_date);
      return cDate.getMonth() === monthKey && cDate.getFullYear() === yearKey;
    });

    // Sum patrimonio or count cases? Design shows bars, likely value or count. 
    // Given "Distribuição Patrimonial", let's sum patrimonio.
    const totalValue = casesInMonth.reduce((sum, c) => sum + (c.valor_patrimonio || 0), 0);
    
    return {
      name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      value: totalValue,
      // Highlight current month
      active: monthKey === new Date().getMonth()
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm mb-1">Bem-vindo de volta, {user?.full_name ? `Dr. ${user.full_name.split(' ')[0]}` : 'Dr. Ricardo'}</p>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Visão Geral do Escritório</h1>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="text-blue-600 border-blue-200 bg-white hover:bg-blue-50"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
          <Link to={createPageUrl("NovoCaso")}>
            <Button className="bg-[#1a237e] hover:bg-[#283593] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Fato Jurídico
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCardNew 
          title="Patrimônio sob Gestão"
          value={`R$ ${(totalPatrimonio || 45000000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          trend="+5.2%"
          trendDirection="up"
          subtext="vs mês anterior"
          icon={Building}
          iconBg="bg-[#FFF8E1]"
          iconColor="text-[#FFC107]"
        />
        <StatsCardNew 
          title="ITCMD Calculado"
          value={`R$ ${(totalITCMD || 1200000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          trend="+12%"
          trendDirection="up"
          subtext="crescimento YTD"
          icon={Calculator}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCardNew 
          title="Processos Ativos"
          value={processosAtivos || 24}
          subtext="8 em fase final"
          icon={Gavel}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
        />
        <StatsCardNew 
          title="Prazos Críticos"
          value={prazosCriticos}
          urgent={true}
          subtext="Próximo vencimento: Hoje, 18:00"
          icon={Calendar}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Charts & Activity) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Distribuição Patrimonial e Evolução</h3>
                <Button variant="outline" size="sm" className="text-xs h-8">Últimos 6 Meses</Button>
              </div>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={40}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.active ? '#D4AF37' : '#9fa8da'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Table */}
          <RecentActivityTable casos={casos} />
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          <IAWidget />
          <ModelagemWidget />
          <PendingTasksWidget tasks={tasks} onToggleTask={handleTaskToggle} />
        </div>

      </div>
    </div>
  );
}