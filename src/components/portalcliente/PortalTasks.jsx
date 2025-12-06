import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function PortalTasks({ tasks }) {
  const statusConfig = {
    pendente: { color: "bg-amber-100 text-amber-700", icon: Clock },
    em_andamento: { color: "bg-blue-100 text-blue-700", icon: Clock },
    concluida: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    cancelada: { color: "bg-red-100 text-red-700", icon: AlertCircle },
  };

  return (
    <div className="space-y-4">
       <Card className="glassmorphism border border-slate-200 card-shadow">
        <CardHeader>
            <CardTitle className="text-lg font-bold text-[#111827]">Minhas Tarefas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
            {tasks.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Nenhuma tarefa pendente.</p>
            ) : (
                <div className="space-y-3">
                    {tasks.map(task => {
                        const config = statusConfig[task.status] || statusConfig.pendente;
                        const Icon = config.icon;
                        return (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-full ${config.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{task.titulo}</p>
                                        <p className="text-sm text-slate-500">{task.descricao}</p>
                                        {task.data_vencimento && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Vence em: {format(new Date(task.data_vencimento), 'dd/MM/yyyy')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Badge variant="outline" className={config.color}>
                                    {task.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            )}
        </CardContent>
       </Card>
    </div>
  );
}