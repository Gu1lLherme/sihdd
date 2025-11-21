import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Trash2, Edit, X } from "lucide-react";

export default function DetalhesMembro({ selectedPerson, onClose, onEdit, onDelete }) {
  if (!selectedPerson) {
    return (
      <Card className="border-2 border-slate-200 border-dashed h-full flex items-center justify-center min-h-[300px]">
        <CardContent className="p-8 text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Clique em um herdeiro na árvore para ver e editar seus detalhes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-[#4169E1] h-full sticky top-6">
      <CardHeader className="bg-blue-50 border-b-2 border-[#4169E1] flex flex-row items-center justify-between p-4">
        <CardTitle className="text-[#333333] text-lg">Detalhes</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#4169E1] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="font-bold text-xl text-[#333333] leading-tight">{selectedPerson.nome}</h3>
          <Badge className="mt-2 text-sm px-3 py-1 bg-blue-100 text-[#4169E1] hover:bg-blue-200 border-0">
            {selectedPerson.parentesco}
          </Badge>
        </div>

        <div className="space-y-4 pt-2">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">CPF</p>
            <p className="text-sm font-medium text-[#333333]">{selectedPerson.cpf || "Não informado"}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Email</p>
            <p className="text-sm font-medium text-[#333333]">{selectedPerson.email || "Não informado"}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Participação na Partilha</p>
            <div className="flex items-center justify-between">
               <p className="text-xl font-bold text-[#4169E1]">{selectedPerson.percentual_partilha}%</p>
               <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4169E1]" style={{width: `${selectedPerson.percentual_partilha}%`}}></div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
              variant="outline" 
              className="w-full border-[#4169E1] text-[#4169E1] hover:bg-blue-50"
              onClick={() => onEdit(selectedPerson)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}