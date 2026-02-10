import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import EventForm from "../components/calendar/EventForm";
import CalendarGrid from "../components/calendar/CalendarGrid";
import EventDetail from "../components/calendar/EventDetail";

export default function Calendar() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CalendarEvent.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setShowForm(false);
      setEditingEvent(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CalendarEvent.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setShowForm(false);
      setEditingEvent(null);
      setSelectedEvent(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CalendarEvent.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setSelectedEvent(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
    setSelectedEvent(null);
  };

  const handleDelete = (event) => {
    if (confirm(`Tem certeza que deseja deletar o evento "${event.titulo}"?`)) {
      deleteMutation.mutate(event.id);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const stats = {
    total: events.length,
    prazo_itcmd: events.filter(e => e.tipo === "prazo_itcmd").length,
    audiencias: events.filter(e => e.tipo === "audiencia").length,
    hoje: events.filter(e => {
      const eventDate = new Date(e.data_inicio).toDateString();
      return eventDate === new Date().toDateString();
    }).length,
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
          <Button 
            onClick={() => {
              setEditingEvent(null);
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-[#1a237e] hover:bg-[#151b60] text-white shadow-lg font-bold"
          >
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

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <EventForm
                event={editingEvent}
                casos={casos}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-slate-200">
              <CardHeader className="bg-blue-50 border-b-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#333333] capitalize">
                    {selectedDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth(-1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
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
                      onClick={() => navigateMonth(1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CalendarGrid
                  selectedDate={selectedDate}
                  events={events}
                  onEventClick={(event) => setSelectedEvent(event)}
                  onDayClick={(date) => {
                    setSelectedDate(date);
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Event Detail or Upcoming */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <EventDetail
                    event={selectedEvent}
                    caso={casos.find(c => c.id === selectedEvent.caso_id)}
                    onClose={() => setSelectedEvent(null)}
                    onEdit={() => handleEdit(selectedEvent)}
                    onDelete={() => handleDelete(selectedEvent)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="border-2 border-slate-200">
                    <CardHeader className="bg-blue-50 border-b-2 border-slate-200">
                      <CardTitle className="text-lg text-[#333333] flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#4169E1]" />
                        Próximos Eventos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {events.filter(e => new Date(e.data_inicio) >= new Date()).slice(0, 5).map((event) => {
                        const caso = casos.find(c => c.id === event.caso_id);
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="p-3 bg-blue-50 border-l-4 border-[#4169E1] rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                          >
                            <h4 className="font-bold text-sm text-[#333333] mb-1">{event.titulo}</h4>
                            <p className="text-xs text-[#AAAAAA]">
                              {new Date(event.data_inicio).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(event.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {caso && (
                              <p className="text-xs text-[#4169E1] mt-1">📁 {caso.nome_falecido}</p>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}