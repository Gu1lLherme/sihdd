import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CreditCard, CheckCircle2, DollarSign, Calculator } from "lucide-react";

export default function StatsOverview({ stats }) {
  const statsData = [
    {
      title: "Total de Casos",
      value: stats.total,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Em Análise",
      value: stats.emAnalise,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Aguardando Pagamento",
      value: stats.aguardandoPagamento,
      icon: CreditCard,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Concluídos",
      value: stats.concluidos,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Patrimônio Total",
      value: `R$ ${stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "ITCMD Total",
      value: `R$ ${stats.itcmdTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Calculator,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}