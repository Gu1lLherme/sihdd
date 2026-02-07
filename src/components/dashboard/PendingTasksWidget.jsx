import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function PendingTasksWidget({ tasks = [], onToggleTask }) {
  // Filter pending tasks and sort by priority/date
  const pendingTasks = tasks
    .filter(t => t.status !== 'concluida' && t.status !== 'cancelada')
    .slice(0, 5);

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Tarefas Pendentes</h3>
        </div>

        <div className="space-y-4">
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Nenhuma tarefa pendente.</p>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                <Checkbox 
                  id={`task-${task.id}`} 
                  checked={task.status === 'concluida'}
                  onCheckedChange={() => onToggleTask && onToggleTask(task)}
                  className="mt-1 rounded-full data-[state=checked]:bg-blue-600 data-[state=checked]:text-white border-slate-300" 
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`task-${task.id}`} 
                    className={`text-sm font-medium block cursor-pointer ${task.status === 'concluida' ? 'text-slate-400 line-through' : 'text-slate-900'}`}
                  >
                    {task.titulo}
                  </label>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {task.descricao || "Sem descrição"}
                  </p>
                  {task.data_vencimento && (
                     <p className="text-[10px] text-red-500 mt-0.5">
                       Vence: {new Date(task.data_vencimento).toLocaleDateString()}
                     </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}