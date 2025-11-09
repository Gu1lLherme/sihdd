import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText, BarChart3, Calendar } from "lucide-react";

export default function Relatorios() {
  const { data: casos } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list("-created_date"),
    initialData: [],
  });

  const downloadCSV = () => {
    const headers = ['Falecido', 'Patrimônio', 'ITCMD', 'Status', 'Data Óbito'];
    const rows = casos.map(c => [
      c.nome_falecido,
      c.valor_patrimonio || 0,
      c.valor_itcmd || 0,
      c.status,
      c.data_obito
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_sihdd_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPatrimonio = casos.reduce((sum, c) => sum + (c.valor_patrimonio || 0), 0);
  const totalITCMD = casos.reduce((sum, c) => sum + (c.valor_itcmd || 0), 0);
  const casosFinalizados = casos.filter(c => c.status === 'finalizado').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Relatórios e Estatísticas</h1>
          <p className="text-slate-600">Visualize e exporte dados consolidados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-none shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total de Casos</p>
                <p className="text-2xl font-bold text-[#1e3a5f]">{casos.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Patrimônio Total</p>
                <p className="text-2xl font-bold text-[#1e3a5f]">
                  {totalPatrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">ITCMD Total</p>
                <p className="text-2xl font-bold text-amber-600">
                  {totalITCMD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 border-none shadow-xl text-center">
          <FileText className="w-20 h-20 mx-auto mb-4 text-[#1e3a5f]" />
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
            Exportar Relatório Completo
          </h2>
          <p className="text-slate-600 mb-6">
            Baixe um arquivo CSV com todos os casos cadastrados no sistema
          </p>
          <Button
            onClick={downloadCSV}
            disabled={casos.length === 0}
            className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] hover:from-[#2d5a8f] hover:to-[#1e3a5f]"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar para CSV
          </Button>
        </Card>
      </div>
    </div>
  );
}