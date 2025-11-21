import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";

export default function CanvasArvore({ casoAtual, herdeiros, selectedPersonId, onSelectPerson, onCreatePerson, zoomLevel }) {
  return (
    <Card className="border-2 border-slate-200 h-[600px] overflow-hidden">
      <CardContent className="p-6 h-full bg-slate-50 relative overflow-auto custom-scrollbar">
        {casoAtual ? (
          <div 
            className="flex flex-col items-center justify-start space-y-8 pt-8 min-w-max min-h-max transition-transform origin-top"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Deceased */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-white shadow-xl mb-2 relative group cursor-help">
                <User className="w-12 h-12 text-white" />
                <div className="absolute -bottom-2 bg-black text-white text-[10px] px-2 py-0.5 rounded-full">Falecido</div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-lg text-center border-2 border-slate-200">
                <p className="font-bold text-[#333333] text-lg">{casoAtual.nome_falecido}</p>
                <p className="text-xs text-slate-500">{new Date(casoAtual.data_obito).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Connectors */}
            <div className="flex flex-col items-center">
              <div className="w-px h-12 bg-slate-400" />
              {herdeiros.length > 0 && (
                <div className="h-px bg-slate-400" style={{ width: `${Math.max((herdeiros.length - 1) * 120, 0)}px` }} />
              )}
            </div>

            {/* Heirs */}
            <div className="flex flex-wrap justify-center gap-8 items-start">
              {herdeiros.map((herdeiro) => {
                const isSelected = selectedPersonId === herdeiro.id;
                const hasDocuments = herdeiro.id.length % 2 === 0; 
                
                return (
                  <div
                    key={herdeiro.id}
                    onClick={() => onSelectPerson(herdeiro)}
                    className="flex flex-col items-center cursor-pointer group relative"
                  >
                     <div className="h-8 w-px bg-slate-400 absolute -top-8" />
                    <div className={`
                      w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl mb-2 transition-all
                      ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50 scale-110' : 'hover:scale-105'}
                      ${hasDocuments ? 'bg-green-500 border-white' : 'bg-amber-500 border-white'}
                    `}>
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className={`
                      bg-white rounded-xl p-3 shadow-lg text-center border-2 transition-colors max-w-[140px]
                      ${isSelected ? 'border-[#4169E1] bg-blue-50' : 'border-slate-200'}
                    `}>
                      <p className="font-bold text-sm text-[#333333] truncate w-full">{herdeiro.nome}</p>
                      <Badge variant={isSelected ? "default" : "outline"} className={`mt-1 text-xs ${isSelected ? "bg-[#4169E1]" : ""}`}>
                        {herdeiro.parentesco}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {herdeiros.length === 0 && (
                <div className="text-center p-4 border-2 border-dashed border-slate-300 rounded-lg bg-white/50">
                  <p className="text-slate-500 text-sm">Nenhum herdeiro cadastrado.</p>
                  <Button variant="link" onClick={onCreatePerson} className="text-[#4169E1]">
                    + Adicionar Herdeiro
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Users className="w-20 h-20 text-[#AAAAAA] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#333333] mb-2">Nenhuma Árvore Selecionada</h3>
              <p className="text-[#AAAAAA]">Selecione um caso acima para visualizar a árvore genealógica</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}