import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Calendar as CalendarIcon, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

import Tasks from "./Tasks";
import CalendarPage from "./Calendar";
import VisaoGeral from "@/components/gestaoprazos/VisaoGeral";

export default function GestaoPrazos() {
  const allowed = ["visao_geral", "tasks", "calendar", "portal"];
  const getInitial = () => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    return allowed.includes(t) ? t : "visao_geral";
  };
  const [tab, setTab] = useState(getInitial());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [tab]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list("-created_date"),
    initialData: [],
  });

  const { data: events = [] } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: () => base44.entities.CalendarEvent.list("-data_inicio"),
    initialData: [],
  });

  // Badges calculados
  const tarefasAtrasadas = tasks.filter(t => {
    if (!t.data_vencimento || t.status === "concluida" || t.status === "cancelada") return false;
    return new Date(t.data_vencimento) < today;
  }).length;

  const tarefasPendentes = tasks.filter(t => t.status === "pendente" || t.status === "em_andamento").length;

  const eventosHoje = events.filter(e => {
    const d = new Date(e.data_inicio);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).length;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Gestão & Prazos</h1>
          <p className="text-slate-600">Gerencie tarefas, calendário e o portal do cliente em um só lugar</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 h-auto flex-wrap gap-1">
            <TabsTrigger value="visao_geral" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Visão Geral
              {(tarefasAtrasadas > 0) && (
                <Badge className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0 h-4 min-w-4">
                  {tarefasAtrasadas}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Tarefas
              {tarefasPendentes > 0 && (
                <Badge className="ml-1 bg-blue-500 text-white text-[10px] px-1.5 py-0 h-4 min-w-4">
                  {tarefasPendentes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              Calendário
              {eventosHoje > 0 && (
                <Badge className="ml-1 bg-amber-500 text-white text-[10px] px-1.5 py-0 h-4 min-w-4">
                  {eventosHoje}
                </Badge>
              )}
            </TabsTrigger>

          </TabsList>

          <TabsContent value="visao_geral">
            <VisaoGeral tasks={tasks} events={events} onNavigate={setTab} />
          </TabsContent>
          <TabsContent value="tasks">
            <Tasks />
          </TabsContent>
          <TabsContent value="calendar">
            <CalendarPage />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}