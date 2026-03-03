import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Users, Heart } from "lucide-react";

export default function CanvasArvore({ casoAtual, herdeiros, selectedPersonId, onSelectPerson, onCreatePerson, zoomLevel }) {
  return (
    <Card className="border-2 border-slate-200 h-[600px] overflow-hidden">
      <CardContent className="p-6 h-full bg-slate-50 relative overflow-auto custom-scrollbar">
        {casoAtual ? (
          <div 
            className="flex flex-col items-center justify-start space-y-8 pt-8 min-w-max min-h-max transition-transform origin-top"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Couple Container */}
            <div className="flex items-start justify-center gap-4">
              {/* Deceased */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-white shadow-xl mb-2 relative group cursor-help">
                  <User className="w-12 h-12 text-white" />
                  <div className="absolute -bottom-2 bg-black text-white text-[10px] px-2 py-0.5 rounded-full">Falecido</div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-lg text-center border-2 border-slate-200 min-w-[160px]">
                  <p className="font-bold text-[#333333] text-lg">{casoAtual.nome_falecido}</p>
                  <p className="text-xs text-slate-500">{new Date(casoAtual.data_obito).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Spouse Connector & Spouse */}
              {casoAtual.conjuge_nome && (
                <>
                  <div className="w-16 h-1 bg-slate-300 mt-12 relative flex justify-center shrink-0">
                    <div className="absolute -top-3 bg-slate-50 p-1 rounded-full">
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center border-4 border-white shadow-xl mb-2 relative group cursor-help">
                      <User className="w-12 h-12 text-white" />
                      <div className="absolute -bottom-2 bg-pink-800 text-white text-[10px] px-2 py-0.5 rounded-full">Cônjuge</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-lg text-center border-2 border-slate-200 min-w-[160px]">
                      <p className="font-bold text-[#333333] text-lg">{casoAtual.conjuge_nome}</p>
                      <p className="text-xs text-slate-500">Sobrevivente</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Heirs Section */}
            {herdeiros.length > 0 ? (
              <div className="flex flex-col items-center">
                {/* Vertical line from couple center */}
                <div className="w-px h-12 bg-slate-400" />
                
                {/* Horizontal bar connecting all heirs */}
                <div className="relative">
                  <div 
                    className="h-px bg-slate-400" 
                    style={{ width: `${(herdeiros.length - 1) * 146}px` }} 
                  />
                </div>

                {/* Heirs row */}
                <div className="flex justify-center items-start">
                  {herdeiros.map((herdeiro, index) => {
                    const isSelected = selectedPersonId === herdeiro.id;
                    const hasDocuments = herdeiro.id.length % 2 === 0; 
                    
                    return (
                      <div
                        key={herdeiro.id}
                        onClick={() => onSelectPerson(herdeiro)}
                        className="flex flex-col items-center cursor-pointer group"
                        style={{ width: '146px' }}
                      >
                        {/* Vertical connector to each child */}
                        <div className="h-8 w-px bg-slate-400" />
                        <div className={`
                          w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl mb-2 transition-all
                          ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50 scale-110' : 'hover:scale-105'}
                          ${hasDocuments ? 'bg-green-500 border-white' : 'bg-amber-500 border-white'}
                        `}>
                          <User className="w-10 h-10 text-white" />
                        </div>
                        <div className={`
                          bg-white rounded-xl p-3 shadow-lg text-center border-2 transition-colors w-[130px]
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
                </div>
              </div>
            ) : (
              <div className="text-center p-4 border-2 border-dashed border-slate-300 rounded-lg bg-white/50 mt-4">
                <p className="text-slate-500 text-sm">Nenhum herdeiro cadastrado.</p>
                <Button variant="link" onClick={onCreatePerson} className="text-[#4169E1]">
                  + Adicionar Herdeiro
                </Button>
              </div>
            )}
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