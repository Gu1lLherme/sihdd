import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function PendingTasksWidget({ tasks = [], onToggleTask }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskTitle("");
      setIsAdding(false);
      toast.success("Tarefa criada!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tarefa excluída!");
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createMutation.mutate({
      titulo: newTaskTitle,
      status: "pendente",
      prioridade: "media",
      tipo: "outro"
    });
  };

  const handleDelete = (id) => {
    if (confirm("Excluir tarefa?")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter pending tasks and sort by priority/date
  const pendingTasks = tasks
    .filter(t => t.status !== 'concluida' && t.status !== 'cancelada')
    .slice(0, 5);

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a237e] text-sm uppercase tracking-wide">Tarefas Pendentes</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsAdding(!isAdding)}
            className="h-6 w-6"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>

        {isAdding && (
          <form onSubmit={handleCreate} className="mb-4 flex gap-2">
            <Input 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Nova tarefa..."
              className="h-8 text-sm"
              autoFocus
            />
            <Button type="submit" size="sm" className="h-8 bg-[#1a237e] text-white">Add</Button>
          </form>
        )}

        <div className="space-y-4">
          {pendingTasks.length === 0 && !isAdding ? (
            <p className="text-sm text-slate-500 text-center py-4">Nenhuma tarefa pendente.</p>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 group">
                <Checkbox 
                  id={`task-${task.id}`} 
                  checked={task.status === 'concluida'}
                  onCheckedChange={() => onToggleTask && onToggleTask(task)}
                  className="mt-1 rounded-full data-[state=checked]:bg-blue-600 data-[state=checked]:text-white border-slate-300" 
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`task-${task.id}`} 
                    className={`text-sm font-medium block cursor-pointer ${task.status === 'concluida' ? 'text-slate-400 line-through' : 'text-[#1a237e]'}`}
                  >
                    {task.titulo}
                  </label>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {task.descricao || "Sem descrição"}
                  </p>
                  {task.data_vencimento && (
                     <p className="text-[10px] text-red-500 mt-0.5">
                       Vence: {new Date(task.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                     </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}