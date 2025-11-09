import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, Activity } from "lucide-react";

export default function DashboardCharts({ casos }) {
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

  const itcmdData = last6Months.map(({ month, monthIndex, year }) => {
    const total = casos
      .filter(c => {
        const createdDate = new Date(c.created_date);
        return createdDate.getMonth() === monthIndex && createdDate.getFullYear() === year;
      })
      .reduce((sum, c) => sum + (c.valor_itcmd || 0), 0);
    return { name: month, itcmd: Math.round(total) };
  });

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

  const COLORS = ['#4169E1', '#5a7bea', '#28A745', '#FFC107', '#10B981', '#F59E0B', '#06B6D4'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Evolução de Casos - Azul Royal */}
      <Card className="bg-white border-2 border-slate-200 card-shadow-hover">
        <CardHeader className="border-b-2 border-slate-200 bg-blue-50">
          <CardTitle className="text-lg flex items-center gap-2 text-[#333333]">
            <Activity className="w-5 h-5 text-[#4169E1]" />
            Evolução de Casos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={casosData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#333333" style={{ fontSize: '12px', fontWeight: 600 }} />
              <YAxis stroke="#333333" style={{ fontSize: '12px', fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '2px solid #4169E1',
                  borderRadius: '12px',
                  fontWeight: 600
                }}
              />
              <Bar dataKey="casos" fill="#4169E1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribuição por Status */}
      <Card className="bg-white border-2 border-slate-200 card-shadow-hover">
        <CardHeader className="border-b-2 border-slate-200 bg-blue-50">
          <CardTitle className="text-lg flex items-center gap-2 text-[#333333]">
            <PieChartIcon className="w-5 h-5 text-[#4169E1]" />
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
                  backgroundColor: '#FFFFFF', 
                  border: '2px solid #4169E1',
                  borderRadius: '12px',
                  fontWeight: 600
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ITCMD Coletado - Dourado */}
      <Card className="bg-white border-2 border-[#FFC107] card-shadow-hover">
        <CardHeader className="border-b-2 border-[#FFC107] bg-amber-50">
          <CardTitle className="text-lg flex items-center gap-2 text-[#333333]">
            <TrendingUp className="w-5 h-5 text-[#FFC107]" />
            ITCMD Coletado (Premium)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={itcmdData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#333333" style={{ fontSize: '12px', fontWeight: 600 }} />
              <YAxis stroke="#333333" style={{ fontSize: '12px', fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '2px solid #FFC107',
                  borderRadius: '12px',
                  fontWeight: 600
                }}
                formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Line 
                type="monotone" 
                dataKey="itcmd" 
                stroke="#FFC107" 
                strokeWidth={3}
                dot={{ fill: '#FFC107', r: 6, strokeWidth: 2, stroke: '#e6ac00' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}