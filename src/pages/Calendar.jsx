import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";

const colorConfig = {
  royal: { bg: "bg-blue-100", border: "border-[#4169E1]", text: "text-[#4169E1]", dot: "bg-[#4169E1]" },
  gold: { bg: "bg-amber-100", border: "border-[#FFC107]", text: "text-[#FFC107]", dot: "bg-[#FFC107]" },
  green: { bg: "bg-green-100", border: "border-[#28A745]", text: "text-[#28A745]", dot: "bg-[#28A745]" },
  red: { bg: "bg-red-100", border: "border-red-700", text: "text-red-700", dot: "bg-red-700" },
  gray: { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-700", dot: "bg-slate-700" },
};

const tipoConfig = {
  prazo_itcmd: { label: "Prazo ITCMD", color: "gold", icon: CalendarIcon },
  audiencia: { label: "Audiência", color: "royal", icon: Users },
  reuniao: { label: "Reunião", color: "royal", icon: Users },
  vencimento: { label: "Vencimento", color: "red", icon: Clock },
  entrega_documento: { label: "Entrega Documento", color: "green", icon: CalendarIcon },
  outro: { label: "Outro", color: "gray", icon: CalendarIcon },
};

export default function Calendar() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month, week, day

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: () => base44.entities.CalendarEvent.list("-data_inicio"),
    initialData: [],
  });

  const { data: casos } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list(),
    initialData: [],
  });

  // Agrupar eventos por data
  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = new Date(event.data_inicio).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  // Próximos eventos (próximos 7 dias)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.data_inicio);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= now && eventDate <= sevenDaysFromNow;
  }).slice(0, 5);

  // Stats
  const stats = {
    total: events.length,
    prazo_itcmd: events.filter(e => e.tipo === "prazo_itcmd").length,
    audiencias: events.filter(e => e.tipo === "audiencia").length,
    hoje: eventsByDate[new Date().toDateString()]?.length || 0,
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4169E1] rounded-xl flex items-center justify-center shadow-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]">Calendário Jurídico</h1>
              <p className="text-sm text-[#AAAAAA]">Prazos, audiências e compromissos</p>
            </div>
          </div>
          <Button className="w-full sm:w-auto bg-[#4169E1] hover:bg-[#3151c7] text-white shadow-lg font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="w-4 h-4 text-[#4169E1]" />
                <p className="text-xs font-bold text-[#AAAAAA] uppercase">Total Eventos</p>
              </div>
              <p className="text-2xl font-bold text-[#4169E1]">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#FFC107]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#FFC107]" />
                <p className="text-xs font-bold text-[#AAAAAA] uppercase">Prazos ITCMD</p>
              </div>
              <p className="text-2xl font-bold text-[#FFC107]">{stats.prazo_itcmd}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#4169E1]" />
                <p className="text-xs font-bold text-[#AAAAAA] uppercase">Audiências</p>
              </div>
              <p className="text-2xl font-bold text-[#4169E1]">{stats.audiencias}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon className="w-4 h-4 text-[#28A745]" />
                <p className="text-xs font-bold text-[#AAAAAA] uppercase">Hoje</p>
              </div>
              <p className="text-2xl font-bold text-[#28A745]">{stats.hoje}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximos Eventos */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-slate-200">
              <CardHeader className="bg-blue-50 border-b-2 border-slate-200">
                <CardTitle className="text-lg text-[#333333] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4169E1]" />
                  Próximos 7 Dias
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-[#AAAAAA] text-center py-8">Nenhum evento próximo</p>
                ) : (
                  upcomingEvents.map((event) => {
                    const tipoInfo = tipoConfig[event.tipo];
                    const colorInfo = colorConfig[tipoInfo.color];
                    const Icon = tipoInfo.icon;
                    const caso = casos.find(c => c.id === event.caso_id);

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 ${colorInfo.bg} border-l-4 ${colorInfo.border} rounded-lg`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-8 h-8 ${colorInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${colorInfo.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-[#333333] mb-1 line-clamp-1">
                              {event.titulo}
                            </h4>
                            <Badge variant="outline" className={`${colorInfo.text} text-xs mb-2`}>
                              {tipoInfo.label}
                            </Badge>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs text-[#AAAAAA]">
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(event.data_inicio).toLocaleDateString('pt-BR')} às{' '}
                                {new Date(event.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {caso && (
                                <div className="text-xs text-[#4169E1]">
                                  📁 {caso.nome_falecido}
                                </div>
                              )}
                              {event.local && (
                                <div className="flex items-center gap-2 text-xs text-[#AAAAAA]">
                                  <MapPin className="w-3 h-3" />
                                  {event.local}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calendário Visual (Placeholder) */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-slate-200">
              <CardHeader className="bg-blue-50 border-b-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#333333]">
                    {selectedDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      ←
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Hoje
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <CalendarIcon className="w-20 h-20 text-[#AAAAAA] mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-[#333333] mb-2">
                    Calendário Visual em Desenvolvimento
                  </h3>
                  <p className="text-sm text-[#AAAAAA] mb-4">
                    A visualização completa do calendário será implementada em breve
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    <Badge className="bg-blue-100 text-[#4169E1]">
                      <span className="w-2 h-2 rounded-full bg-[#4169E1] mr-2" />
                      Audiências
                    </Badge>
                    <Badge className="bg-amber-100 text-[#FFC107]">
                      <span className="w-2 h-2 rounded-full bg-[#FFC107] mr-2" />
                      Prazos ITCMD
                    </Badge>
                    <Badge className="bg-green-100 text-[#28A745]">
                      <span className="w-2 h-2 rounded-full bg-[#28A745] mr-2" />
                      Entregas
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legenda */}
        <Card className="border-2 border-slate-200 mt-6">
          <CardHeader className="bg-[#F5F5F5] border-b-2 border-slate-200">
            <CardTitle className="text-lg text-[#333333]">Legenda de Tipos de Evento</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(tipoConfig).map(([key, config]) => {
                const colorInfo = colorConfig[config.color];
                const Icon = config.icon;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-8 h-8 ${colorInfo.bg} border-2 ${colorInfo.border} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${colorInfo.text}`} />
                    </div>
                    <span className="text-sm font-medium text-[#333333]">{config.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}