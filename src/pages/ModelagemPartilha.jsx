import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Home, Car, TrendingUp, Download, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const REGIMES_BENS = {
  comunhao_universal: "Comunhão Universal de Bens",
  comunhao_parcial: "Comunhão Parcial de Bens",
  separacao_total: "Separação Total de Bens",
  participacao_final: "Participação Final nos Aquestos",
};

export default function ModelagemPartilha() {
  const [selectedCaso, setSelectedCaso] = useState("");
  const [regimeBens, setRegimeBens] = useState("comunhao_parcial");
  const [partilha, setPartilha] = useState({});

  const { data: casos } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list(),
    initialData: [],
  });

  const { data: herdeiros } = useQuery({
    queryKey: ['herdeiros', selectedCaso],
    queryFn: () => base44.entities.Herdeiro.list(),
    initialData: [],
    enabled: !!selectedCaso,
  });

  const { data: bens } = useQuery({
    queryKey: ['bens', selectedCaso],
    queryFn: () => base44.entities.Bem.list(),
    initialData: [],
    enabled: !!selectedCaso,
  });

  const casoAtual = casos.find(c => c.id === selectedCaso);
  const herdeirosDosCaso = herdeiros.filter(h => h.caso_id === selectedCaso);
  const bensDosCaso = bens.filter(b => b.caso_id === selectedCaso);

  const bensDisponiveis = bensDosCaso.filter(b => !Object.values(partilha).flat().includes(b.id));

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const herdeiroId = result.destination.droppableId;
    const bemId = result.draggableId;

    setPartilha(prev => ({
      ...prev,
      [herdeiroId]: [...(prev[herdeiroId] || []), bemId]
    }));
  };

  const getValorPartilha = (herdeiroId) => {
    const bensIds = partilha[herdeiroId] || [];
    return bensIds.reduce((sum, id) => {
      const bem = bensDosCaso.find(b => b.id === id);
      return sum + (bem?.valor || 0);
    }, 0);
  };

  const totalPartilhado = Object.keys(partilha).reduce((sum, hId) => sum + getValorPartilha(hId), 0);
  const totalPatrimonio = bensDosCaso.reduce((sum, b) => sum + b.valor, 0);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4169E1] to-[#3151c7] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Estate Partition Modeling</h1>
                <p className="text-blue-100 text-sm">Simulate asset distribution among heirs</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={regimeBens} onValueChange={setRegimeBens}>
                <SelectTrigger className="w-64 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REGIMES_BENS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="bg-white text-[#4169E1] hover:bg-blue-50">
                Recalculate
              </Button>
            </div>
          </div>
        </div>

        {/* Case Selection */}
        <Card className="border-2 border-slate-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label className="font-bold text-[#333333]">Select Case:</Label>
              <Select value={selectedCaso} onValueChange={setSelectedCaso}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an estate case" />
                </SelectTrigger>
                <SelectContent>
                  {casos.map((caso) => (
                    <SelectItem key={caso.id} value={caso.id}>
                      {caso.nome_falecido} - R$ {caso.valor_patrimonio?.toLocaleString('pt-BR')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedCaso ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Available Assets */}
              <Card className="border-2 border-[#4169E1]">
                <CardHeader className="bg-blue-50 border-b-2 border-[#4169E1]">
                  <CardTitle className="flex items-center gap-2 text-[#333333]">
                    <TrendingUp className="w-5 h-5 text-[#4169E1]" />
                    Total Estate - Available Assets
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Droppable droppableId="available">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-96">
                        {bensDisponiveis.map((bem, index) => (
                          <Draggable key={bem.id} draggableId={bem.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-move"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {bem.tipo === 'imovel' ? <Home className="w-6 h-6 text-[#4169E1]" /> : <Car className="w-6 h-6 text-[#4169E1]" />}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-[#333333]">{bem.descricao}</h4>
                                    <p className="text-sm text-[#AAAAAA]">{bem.tipo}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg text-[#4169E1]">
                                      R$ {bem.valor.toLocaleString('pt-BR')}
                                    </p>
                                    <Badge className="bg-green-100 text-green-700 border-0">Available</Badge>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>

              {/* Heirs Distribution */}
              <div className="space-y-4">
                {herdeirosDosCaso.map((herdeiro) => {
                  const valorAtual = getValorPartilha(herdeiro.id);
                  const percentualIdeal = herdeiro.percentual_partilha || 0;
                  const valorIdeal = (totalPatrimonio * percentualIdeal) / 100;
                  const percentualAtual = totalPatrimonio > 0 ? (valorAtual / totalPatrimonio) * 100 : 0;
                  const isCompliant = Math.abs(percentualAtual - percentualIdeal) < 5;

                  return (
                    <Card key={herdeiro.id} className={`border-2 ${isCompliant ? 'border-green-500' : 'border-amber-500'}`}>
                      <CardHeader className={`${isCompliant ? 'bg-green-50' : 'bg-amber-50'} border-b-2`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-[#333333]">{herdeiro.nome}</CardTitle>
                            <p className="text-sm text-[#AAAAAA]">{herdeiro.parentesco}</p>
                          </div>
                          <Badge className={isCompliant ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                            {percentualIdeal}% ideal
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Droppable droppableId={herdeiro.id}>
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-32 space-y-2">
                              {(partilha[herdeiro.id] || []).map((bemId, index) => {
                                const bem = bensDosCaso.find(b => b.id === bemId);
                                return bem ? (
                                  <div key={bemId} className="bg-blue-50 border-2 border-[#4169E1] rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-semibold text-[#333333]">{bem.descricao}</span>
                                      <span className="text-sm font-bold text-[#4169E1]">
                                        R$ {bem.valor.toLocaleString('pt-BR')}
                                      </span>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                              {(partilha[herdeiro.id] || []).length === 0 && (
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-[#AAAAAA]">
                                  Drop assets here
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-[#333333]">Progress:</span>
                            <span className="text-sm font-bold text-[#4169E1]">{percentualAtual.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all ${isCompliant ? 'bg-green-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.min(percentualAtual, 100)}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </DragDropContext>
        ) : (
          <Card className="border-2 border-slate-200">
            <CardContent className="p-12 text-center">
              <Calculator className="w-20 h-20 text-[#AAAAAA] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#333333] mb-2">Select a Case to Start</h3>
              <p className="text-[#AAAAAA]">Choose an estate case to model the partition</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        {selectedCaso && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-2xl p-4 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                {totalPartilhado === totalPatrimonio ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold">Legitimate Share Compliance</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-bold">Pending Distribution</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-[#AAAAAA]">Partitioned vs Total</p>
                <p className="text-lg font-bold text-[#333333]">
                  R$ {totalPartilhado.toLocaleString('pt-BR')} / R$ {totalPatrimonio.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-slate-300">
                  <Save className="w-4 h-4 mr-2" />
                  Save Scenario
                </Button>
                <Button className="bg-[#4169E1] hover:bg-[#3151c7] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Partition Draft (PDF)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}