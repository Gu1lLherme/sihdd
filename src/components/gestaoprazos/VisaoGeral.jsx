import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, Clock, AlertCircle, Calendar as CalendarIcon,
  Shield, ArrowRight, TrendingUp, AlertTriangle, Users, Zap
} from "lucide-react";

const prioridadeConfig = {
  baixa: { label: "Baixa", color: "bg-slate-100 text-slate-700" },
  media: { label: "Média", color: "bg-blue-100 text-blue-700" },
  alta: { label: "Alta", color: "bg-amber-100 text-amber-700" },
  urgente: { label: "Urgente", color: "bg-red-100 text-red-700" },
};

const statusColors = {
  pendente: "text-slate-600",
  em_andamento: "text-blue-600",
  concluida: "text-green-600",
  cancelada: "text-red-600",
};

export default function VisaoGeral({ tasks = [], events = [], onNavigate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);
  const in3Days = new Date(today);
  in3Days.setDate(today.getDate() + 3);

  // Métricas de Tarefas
  const tarefasPendentes = tasks.filter(t => t.status === "pendente" || t.status === "em_andamento");
  const tarefasAtrasadas = tasks.filter(t => {
    if (!t.data_vencimento || t.status === "concluida" || t.status === "cancelada") return false;
    return new Date(t.data_vencimento) < today;
  });
  const tarefasProximas7 = tasks.filter(t => {
    if (!t.data_vencimento || t.status === "concluida" || t.status === "cancelada") return false;
    const due = new Date(t.data_vencimento);
    return due >= today && due <= in7Days;
  });
  const tarefasUrgentes = tasks.filter(t => t.prioridade === "urgente" && t.status !== "concluida" && t.status !== "cancelada");

  // Métricas de Calendário
  const eventosHoje = events.filter(e => {
    const d = new Date(e.data_inicio);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  const proximosEventos = events
    .filter(e => new Date(e.data_inicio) >= today)
    .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio))
    .slice(0, 5);
  const prazosCriticos = events.filter(e => {
    const d = new Date(e.data_inicio);
    return d >= today && d <= in3Days && e.tipo === "prazo_itcmd";
  });

  const corAlertaTarefas = tarefasAtrasadas.length > 0 ? "border-red-400 bg-red-50" : tarefasUrgentes.length > 0 ? "border-amber-400 bg-amber-50" : "border-blue-200 bg-blue-50";
  const corAlertaEventos = prazosCriticos.length > 0 ? "border-red-400 bg-red-50" : "border-blue-200 bg-blue-50";

  return (
    <div className="space-y-6">
      {/* KPIs Rápidos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`border-2 ${tarefasAtrasadas.length > 0 ? "border-red-400" : "border-slate-200"}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`w-4 h-4 ${tarefasAtrasadas.length > 0 ? "text-red-500" : "text-slate-400"}`} />
              <p className="text-xs font-bold text-slate-500 uppercase">Atrasadas</p>
            </div>
            <p className={`text-3xl font-bold ${tarefasAtrasadas.length > 0 ? "text-red-600" : "text-slate-600"}`}>
              {tarefasAtrasadas.length}
            </p>
            <p className="text-xs text-slate-400 mt-1">tarefas vencidas</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-bold text-slate-500 uppercase">Próximos 7 dias</p>
            </div>
            <p className="text-3xl font-bold text-amber-600">{tarefasProximas7.length}</p>
            <p className="text-xs text-slate-400 mt-1">tarefas vencendo</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              <p className="text-xs font-bold text-slate-500 uppercase">Eventos Hoje</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{eventosHoje.length}</p>
            <p className="text-xs text-slate-400 mt-1">compromissos</p>
          </CardContent>
        </Card>

        <Card className={`border-2 ${prazosCriticos.length > 0 ? "border-red-400" : "border-green-300"}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className={`w-4 h-4 ${prazosCriticos.length > 0 ? "text-red-500" : "text-green-500"}`} />
              <p className="text-xs font-bold text-slate-500 uppercase">Prazos ITCMD</p>
            </div>
            <p className={`text-3xl font-bold ${prazosCriticos.length > 0 ? "text-red-600" : "text-green-600"}`}>
              {prazosCriticos.length}
            </p>
            <p className="text-xs text-slate-400 mt-1">críticos (3 dias)</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Críticos */}
      {(tarefasAtrasadas.length > 0 || prazosCriticos.length > 0 || tarefasUrgentes.length > 0) && (
        <Card className="border-2 border-red-300 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Atenção Imediata Necessária
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tarefasAtrasadas.length > 0 && (
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {tarefasAtrasadas.length} {tarefasAtrasadas.length === 1 ? "tarefa atrasada" : "tarefas atrasadas"}
                  </span>
                </div>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300 h-7 text-xs" onClick={() => onNavigate("tasks")}>
                  Ver <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
            {prazosCriticos.length > 0 && (
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {prazosCriticos.length} prazo(s) ITCMD nos próximos 3 dias
                  </span>
                </div>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300 h-7 text-xs" onClick={() => onNavigate("calendar")}>
                  Ver <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
            {tarefasUrgentes.length > 0 && (
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {tarefasUrgentes.length} {tarefasUrgentes.length === 1 ? "tarefa urgente" : "tarefas urgentes"} pendentes
                  </span>
                </div>
                <Button size="sm" variant="outline" className="text-amber-600 border-amber-300 h-7 text-xs" onClick={() => onNavigate("tasks")}>
                  Ver <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tarefas Pendentes */}
        <Card className="border-2 border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Tarefas Pendentes
              </CardTitle>
              <Button size="sm" variant="ghost" className="text-blue-600 text-xs h-7" onClick={() => onNavigate("tasks")}>
                Ver todas <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            {tarefasPendentes.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Nenhuma tarefa pendente!</p>
              </div>
            ) : (
              tarefasPendentes.slice(0, 5).map(task => {
                const isAtrasada = task.data_vencimento && new Date(task.data_vencimento) < today;
                const prio = prioridadeConfig[task.prioridade];
                return (
                  <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${isAtrasada ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${isAtrasada ? "bg-red-500" : task.prioridade === "urgente" ? "bg-amber-500" : "bg-blue-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{task.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {prio && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${prio.color}`}>{prio.label}</span>}
                        {task.data_vencimento && (
                          <span className={`text-[10px] ${isAtrasada ? "text-red-600 font-bold" : "text-slate-400"}`}>
                            {isAtrasada ? "⚠ " : ""}
                            {new Date(task.data_vencimento).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {tarefasPendentes.length > 5 && (
              <p className="text-xs text-slate-400 text-center pt-1">
                +{tarefasPendentes.length - 5} tarefas a mais
              </p>
            )}
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card className="border-2 border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Próximos Compromissos
              </CardTitle>
              <Button size="sm" variant="ghost" className="text-blue-600 text-xs h-7" onClick={() => onNavigate("calendar")}>
                Ver calendário <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            {proximosEventos.length === 0 ? (
              <div className="text-center py-6">
                <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Sem eventos próximos</p>
              </div>
            ) : (
              proximosEventos.map(event => {
                const isHoje = (() => { const d = new Date(event.data_inicio); d.setHours(0,0,0,0); return d.getTime() === today.getTime(); })();
                const isPrazo = event.tipo === "prazo_itcmd";
                const isCritico = prazosCriticos.some(p => p.id === event.id);
                return (
                  <div key={event.id} className={`flex items-start gap-3 p-3 rounded-lg border ${isCritico ? "bg-red-50 border-red-200" : isHoje ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className={`shrink-0 text-center min-w-[36px]`}>
                      <p className={`text-lg font-bold leading-none ${isCritico ? "text-red-600" : isHoje ? "text-blue-600" : "text-slate-700"}`}>
                        {new Date(event.data_inicio).getDate()}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase">
                        {new Date(event.data_inicio).toLocaleString('pt-BR', { month: 'short' })}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{event.titulo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isHoje && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">Hoje</span>}
                        {isPrazo && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">ITCMD</span>}
                        <span className="text-[10px] text-slate-400">
                          {new Date(event.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo do Portal */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-600" />
              Portal do Cliente
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-cyan-600 text-xs h-7" onClick={() => onNavigate("portal")}>
              Acessar <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
            <Shield className="w-8 h-8 text-cyan-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-700">Comunicação segura com clientes</p>
              <p className="text-xs text-slate-400 mt-0.5">Acesse o portal para visualizar status dos casos, documentos e mensagens dos clientes.</p>
            </div>
            <Button size="sm" className="ml-auto shrink-0 bg-cyan-600 hover:bg-cyan-700 text-white text-xs" onClick={() => onNavigate("portal")}>
              Ir ao Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}