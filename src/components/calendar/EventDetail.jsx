import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, FileText, X, Edit, Trash2 } from "lucide-react";

const tipoConfig = {
  prazo_itcmd: { label: "Prazo ITCMD", color: "gold" },
  audiencia: { label: "Audiência", color: "royal" },
  reuniao: { label: "Reunião", color: "royal" },
  vencimento: { label: "Vencimento", color: "red" },
  entrega_documento: { label: "Entrega Documento", color: "green" },
  outro: { label: "Outro", color: "gray" },
};

const colorConfig = {
  royal: { bg: "bg-blue-100", text: "text-[#4169E1]", border: "border-[#4169E1]" },
  gold: { bg: "bg-amber-100", text: "text-[#FFC107]", border: "border-[#FFC107]" },
  green: { bg: "bg-green-100", text: "text-[#28A745]", border: "border-[#28A745]" },
  red: { bg: "bg-red-100", text: "text-red-700", border: "border-red-700" },
  gray: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-700" },
};

export default function EventDetail({ event, caso, onClose, onEdit, onDelete }) {
  if (!event) return null;

  const tipoInfo = tipoConfig[event.tipo];
  const colorInfo = colorConfig[tipoInfo.color];

  return (
    <Card className={`border-2 ${colorInfo.border} shadow-xl`}>
      <CardHeader className={`${colorInfo.bg} border-b-2 ${colorInfo.border}`}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-[#333333] mb-2">{event.titulo}</CardTitle>
            <Badge variant="outline" className={`${colorInfo.text} ${colorInfo.border}`}>
              {tipoInfo.label}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className={`w-5 h-5 ${colorInfo.text}`} />
          <div>
            <p className="text-sm font-bold text-[#333333]">Data e Hora</p>
            <p className="text-sm text-[#AAAAAA]">
              {new Date(event.data_inicio).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-[#AAAAAA]">
              {new Date(event.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              {event.data_fim && ` - ${new Date(event.data_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
        </div>

        {event.local && (
          <div className="flex items-center gap-3">
            <MapPin className={`w-5 h-5 ${colorInfo.text}`} />
            <div>
              <p className="text-sm font-bold text-[#333333]">Local</p>
              <p className="text-sm text-[#AAAAAA]">{event.local}</p>
            </div>
          </div>
        )}

        {caso && (
          <div className="flex items-center gap-3">
            <FileText className={`w-5 h-5 ${colorInfo.text}`} />
            <div>
              <p className="text-sm font-bold text-[#333333]">Caso Relacionado</p>
              <p className="text-sm text-[#4169E1] font-semibold">{caso.nome_falecido}</p>
            </div>
          </div>
        )}

        {event.descricao && (
          <div>
            <p className="text-sm font-bold text-[#333333] mb-2">Descrição</p>
            <p className="text-sm text-[#AAAAAA] bg-slate-50 p-3 rounded-lg">{event.descricao}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onEdit}
            className="flex-1 border-[#4169E1] text-[#4169E1] hover:bg-blue-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            onClick={onDelete}
            className="flex-1 border-red-700 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}