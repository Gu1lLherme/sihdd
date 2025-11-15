import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const colorConfig = {
  royal: { bg: "bg-blue-100", text: "text-[#4169E1]", dot: "bg-[#4169E1]" },
  gold: { bg: "bg-amber-100", text: "text-[#FFC107]", dot: "bg-[#FFC107]" },
  green: { bg: "bg-green-100", text: "text-[#28A745]", dot: "bg-[#28A745]" },
  red: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-700" },
  gray: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-700" },
};

const tipoConfig = {
  prazo_itcmd: { color: "gold" },
  audiencia: { color: "royal" },
  reuniao: { color: "royal" },
  vencimento: { color: "red" },
  entrega_documento: { color: "green" },
  outro: { color: "gray" },
};

export default function CalendarGrid({ selectedDate, events, onEventClick, onDayClick }) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  const weeks = [];
  let currentWeek = [];
  
  // Dias do mês anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    currentWeek.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
  }
  
  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push({ day, isCurrentMonth: true });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Dias do próximo mês
  if (currentWeek.length > 0) {
    const remaining = 7 - currentWeek.length;
    for (let day = 1; day <= remaining; day++) {
      currentWeek.push({ day, isCurrentMonth: false });
    }
    weeks.push(currentWeek);
  }

  const getEventsForDate = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return [];
    const dateStr = new Date(year, month, day).toDateString();
    return events.filter(e => new Date(e.data_inicio).toDateString() === dateStr);
  };

  const isToday = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return false;
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 border-b-2 border-slate-200">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="p-2 text-center text-xs font-bold text-[#AAAAAA] uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-rows-6">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7">
            {week.map((dayInfo, dayIdx) => {
              const dayEvents = getEventsForDate(dayInfo.day, dayInfo.isCurrentMonth);
              const isTodayDay = isToday(dayInfo.day, dayInfo.isCurrentMonth);
              
              return (
                <motion.div
                  key={dayIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (weekIdx * 7 + dayIdx) * 0.01 }}
                  onClick={() => dayInfo.isCurrentMonth && onDayClick(new Date(year, month, dayInfo.day))}
                  className={`
                    min-h-24 p-2 border border-slate-200
                    ${dayInfo.isCurrentMonth ? 'bg-white hover:bg-blue-50 cursor-pointer' : 'bg-slate-50'}
                    ${isTodayDay ? 'ring-2 ring-[#4169E1]' : ''}
                    transition-colors
                  `}
                >
                  <div className={`
                    text-sm font-bold mb-1
                    ${dayInfo.isCurrentMonth ? 'text-[#333333]' : 'text-[#AAAAAA]'}
                    ${isTodayDay ? 'text-[#4169E1]' : ''}
                  `}>
                    {dayInfo.day}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      const colorInfo = colorConfig[tipoConfig[event.tipo]?.color || 'gray'];
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className={`
                            ${colorInfo.bg} ${colorInfo.text} text-[10px] px-2 py-1 rounded
                            font-semibold truncate cursor-pointer hover:opacity-80
                          `}
                        >
                          {new Date(event.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} {event.titulo}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-[#AAAAAA] font-bold text-center">
                        +{dayEvents.length - 3} mais
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}