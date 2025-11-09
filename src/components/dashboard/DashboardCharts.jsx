import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, Activity } from "lucide-react";

export default function DashboardCharts({ casos }) {
  // Casos por mês
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      month: date.toLocaleString('pt-BR', { month: 'short' }),
      monthIndex: date.getMonth(),
      year: date.getFullYear()
    };
  }).reverse();

  const casosData = last6Months.map(({ month, monthIndex, year }) => {
    const count = casos.filter(c => {
      const createdDate = new Date(c.created_date);
      return createdDate.getMonth() === monthIndex && createdDate.getFullYear() === year;
    }).length;
    return { name: month, casos: count };
  });

  // ITCMD coletado por mês
  const itcmdData = last6Months.map(({ month, monthIndex, year }) => {
    const total = casos
      .filter(c => {
        const createdDate = new Date(c.created_date);
        return createdDate.getMonth() === monthIndex && createdDate.getFullYear() === year;
      })
      .reduce((sum, c) => sum + (c.valor_itcmd || 0), 0);
    return { name: month, itcmd: Math.round(total) };
  });

  // Status distribution
  const statusLabels = {
    'coleta_dados': 'Coleta de Dados',
    'calculo_itcmd': 'Cálculo ITCMD',
    'geracao_dae': 'Geração DAE',
    'aguardando_pagamento': 'Aguardando Pagamento',
    'em_analise_sefaz': 'Análise SEFAZ',
    'certidao_emitida': 'Certidão Emitida',
    'finalizado': 'Finalizado',
  };

  const statusData = Object.entries(
    casos.reduce((acc, caso) => {
      acc[caso.status] = (acc[caso.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count
  }));

  const COLORS = ['#1E40AF', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Evolução de Casos */}
      <Card className="glassmorphism border border-slate-200 card-shadow-hover">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2 text-[#0B1A2E]">
            <Activity className="w-5 h-5 text-[#1E40AF]" />
            Evolução de Casos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={casosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px', fontWeight: 600 }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px', fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  border: '1px solid #1E40AF',
                  borderRadius: '12px',
                  fontWeight: 600
                }}
              />
              <Bar dataKey="casos" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribuição por Status */}
      <Card className="glassmorphism border border-slate-200 card-shadow-hover">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2 text-[#0B1A2E]">
            <PieChartIcon className="w-5 h-5 text-[#10B981]" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  border: '1px solid #10B981',
                  borderRadius: '12px',
                  fontWeight: 600
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ITCMD Coletado */}
      <Card className="glassmorphism border border-slate-200 card-shadow-hover">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2 text-[#0B1A2E]">
            <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
            ITCMD Coletado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={itcmdData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px', fontWeight: 600 }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px', fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  border: '1px solid #F59E0B',
                  borderRadius: '12px',
                  fontWeight: 600
                }}
                formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Line 
                type="monotone" 
                dataKey="itcmd" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}