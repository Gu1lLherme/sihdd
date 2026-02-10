import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, AlertCircle, Plus, Filter, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const prioridadeConfig = {
  baixa: { label: "Baixa", color: "bg-slate-100 text-slate-700", icon: Clock },
  media: { label: "Média", color: "bg-blue-100 text-[#4169E1]", icon: Clock },
  alta: { label: "Alta", color: "bg-amber-100 text-[#FFC107]", icon: AlertCircle },
  urgente: { label: "Urgente", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-slate-100 text-slate-700", border: "border-slate-300" },
  em_andamento: { label: "Em Andamento", color: "bg-blue-100 text-[#4169E1]", border: "border-[#4169E1]" },
  concluida: { label: "Concluída", color: "bg-green-100 text-[#28A745]", border: "border-[#28A745]" },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-700", border: "border-red-700" },
};

export default function Tasks() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [filtroPrioridade, setFiltroPrioridade] = useState("all");

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list("-created_date"),
    initialData: [],
  });

  const { data: casos } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list(),
    initialData: [],
  });

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "documento",
    prioridade: "media",
    status: "pendente",
    caso_id: "",
    responsavel_email: user?.email || "",
    data_vencimento: "",
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      setShowForm(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      tipo: "documento",
      prioridade: "media",
      status: "pendente",
      caso_id: "",
      responsavel_email: user?.email || "",
      data_vencimento: "",
    });
    setEditingTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      titulo: task.titulo,
      descricao: task.descricao || "",
      tipo: task.tipo,
      prioridade: task.prioridade,
      status: task.status,
      caso_id: task.caso_id || "",
      responsavel_email: task.responsavel_email || user?.email || "",
      data_vencimento: task.data_vencimento || "",
    });
    setShowForm(true);
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filtroStatus === "all" || task.status === filtroStatus;
    const prioridadeMatch = filtroPrioridade === "all" || task.prioridade === filtroPrioridade;
    return statusMatch && prioridadeMatch;
  });

  const stats = {
    total: tasks.length,
    pendentes: tasks.filter(t => t.status === "pendente").length,
    em_andamento: tasks.filter(t => t.status === "em_andamento").length,
    concluidas: tasks.filter(t => t.status === "concluida").length,
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4169E1] rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]">Gestão de Tarefas</h1>
              <p className="text-sm text-[#AAAAAA]">Workflow automatizado de processos</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto bg-[#1a237e] hover:bg-[#151b60] text-white shadow-lg font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Total</p>
              <p className="text-2xl font-bold text-[#4169E1]">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-slate-700">{stats.pendentes}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Em Andamento</p>
              <p className="text-2xl font-bold text-[#4169E1]">{stats.em_andamento}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Concluídas</p>
              <p className="text-2xl font-bold text-[#28A745]">{stats.concluidas}</p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="border-2 border-[#4169E1]">
                <CardHeader className="bg-blue-50 border-b-2 border-[#4169E1]">
                  <CardTitle className="text-lg text-[#333333]">
                    {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Título *</Label>
                        <Input
                          value={formData.titulo}
                          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                          required
                          placeholder="Ex: Revisar documentação"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Caso Relacionado</Label>
                        <Select value={formData.caso_id} onValueChange={(v) => setFormData({ ...formData, caso_id: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um caso" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>Nenhum</SelectItem>
                            {casos.map((caso) => (
                              <SelectItem key={caso.id} value={caso.id}>
                                {caso.nome_falecido}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="documento">Documento</SelectItem>
                            <SelectItem value="calculo">Cálculo</SelectItem>
                            <SelectItem value="reuniao">Reunião</SelectItem>
                            <SelectItem value="prazo">Prazo</SelectItem>
                            <SelectItem value="pagamento">Pagamento</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Prioridade</Label>
                        <Select value={formData.prioridade} onValueChange={(v) => setFormData({ ...formData, prioridade: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                            <SelectItem value="urgente">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Data Vencimento</Label>
                        <Input
                          type="date"
                          value={formData.data_vencimento}
                          onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={3}
                        placeholder="Descreva os detalhes da tarefa..."
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="bg-[#4169E1] hover:bg-[#3151c7] text-white"
                      >
                        {editingTask ? "Atualizar" : "Criar"} Tarefa
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#AAAAAA]" />
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Prioridades</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredTasks.map((task) => {
              const statusInfo = statusConfig[task.status];
              const prioridadeInfo = prioridadeConfig[task.prioridade];
              const PrioIcon = prioridadeInfo.icon;
              const caso = casos.find(c => c.id === task.caso_id);

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className={`border-2 ${statusInfo.border} card-shadow-hover`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-base font-bold text-[#333333] mb-2 line-clamp-2">
                            {task.titulo}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                            <Badge variant="outline" className={prioridadeInfo.color}>
                              <PrioIcon className="w-3 h-3 mr-1" />
                              {prioridadeInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {task.descricao && (
                        <p className="text-sm text-[#AAAAAA] mb-3 line-clamp-2">{task.descricao}</p>
                      )}
                      {caso && (
                        <p className="text-xs text-[#4169E1] mb-2">
                          📁 {caso.nome_falecido}
                        </p>
                      )}
                      {task.data_vencimento && (
                        <div className="flex items-center gap-2 text-xs text-[#AAAAAA]">
                          <CalendarIcon className="w-3 h-3" />
                          Vencimento: {new Date(task.data_vencimento).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                        className="w-full mt-3 border-[#4169E1] text-[#4169E1] hover:bg-[#4169E1] hover:text-white"
                      >
                        Editar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTasks.length === 0 && !isLoading && (
            <div className="col-span-2 text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-[#AAAAAA] mx-auto mb-4" />
              <p className="text-[#AAAAAA]">Nenhuma tarefa encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}