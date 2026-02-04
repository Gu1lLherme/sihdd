import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function PendingTasksWidget({ tasks = [] }) {
  // Use mock data if no tasks provided for visual accuracy with design
  const displayTasks = tasks.length > 0 ? tasks : [
    { id: 1, title: "Revisar minuta de testamento", subtitle: "Cliente: Ana Souza" },
    { id: 2, title: "Enviar guia ITCMD", subtitle: "Vence amanhã" },
  ];

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Tarefas Pendentes</h3>
        </div>

        <div className="space-y-4">
          {displayTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-start gap-3">
              <Checkbox id={`task-${task.id}`} className="mt-1 rounded-full data-[state=checked]:bg-blue-600 data-[state=checked]:text-white border-slate-300" />
              <div className="flex-1">
                <label htmlFor={`task-${task.id}`} className="text-sm font-medium text-slate-900 block cursor-pointer">
                  {task.title || task.titulo}
                </label>
                <p className="text-xs text-slate-500">
                  {task.subtitle || task.descricao || "Sem detalhes"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}