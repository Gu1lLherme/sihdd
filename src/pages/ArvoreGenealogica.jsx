import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, ZoomIn, ZoomOut, Maximize2, User, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function ArvoreGenealogica() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedCaso, setSelectedCaso] = useState("");

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

  const herdeirosDosCaso = herdeiros.filter(h => h.caso_id === selectedCaso);
  const casoAtual = casos.find(c => c.id === selectedCaso);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4169E1] to-[#3151c7] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Árvore Genealógica Sucessória</h1>
                <p className="text-blue-100 text-sm">Organograma genealógico visual</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Toolbar */}
        <div className="flex justify-center mb-6">
          <div className="bg-white border-2 border-slate-200 rounded-full shadow-xl px-4 py-2 flex items-center gap-3">
            <Button size="icon" variant="ghost" className="rounded-full w-10 h-10">
              <Plus className="w-5 h-5 text-[#4169E1]" />
            </Button>
            <div className="w-px h-6 bg-slate-300" />
            <Button size="icon" variant="ghost" className="rounded-full w-10 h-10">
              <ZoomIn className="w-5 h-5 text-[#333333]" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full w-10 h-10">
              <ZoomOut className="w-5 h-5 text-[#333333]" />
            </Button>
            <div className="w-px h-6 bg-slate-300" />
            <Button size="icon" variant="ghost" className="rounded-full w-10 h-10">
              <Maximize2 className="w-5 h-5 text-[#333333]" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-slate-200 h-[600px]">
              <CardContent className="p-6 h-full bg-slate-50 relative">
                {casoAtual && herdeirosDosCaso.length > 0 ? (
                  <div className="flex flex-col items-center justify-start space-y-8 pt-8">
                    {/* Deceased */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-slate-300 flex items-center justify-center border-4 border-white shadow-xl mb-2">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-lg text-center border-2 border-slate-200">
                        <p className="font-bold text-[#333333]">{casoAtual.nome_falecido}</p>
                        <Badge variant="outline" className="mt-1">Falecido</Badge>
                      </div>
                    </div>

                    {/* Connectors */}
                    <div className="w-px h-12 bg-slate-400" />

                    {/* Heirs */}
                    <div className="flex flex-wrap justify-center gap-8">
                      {herdeirosDosCaso.map((herdeiro) => {
                        const hasDocuments = Math.random() > 0.5;
                        return (
                          <div
                            key={herdeiro.id}
                            onClick={() => setSelectedPerson(herdeiro)}
                            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                          >
                            <div className={`w-20 h-20 rounded-full ${hasDocuments ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center border-4 border-white shadow-xl mb-2`}>
                              <User className="w-10 h-10 text-white" />
                            </div>
                            <div className="bg-white rounded-xl p-3 shadow-lg text-center border-2 border-slate-200 max-w-32">
                              <p className="font-bold text-sm text-[#333333] truncate">{herdeiro.nome}</p>
                              <Badge variant="outline" className="mt-1 text-xs">{herdeiro.parentesco}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Users className="w-20 h-20 text-[#AAAAAA] mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-[#333333] mb-2">Nenhuma Árvore Genealógica Disponível</h3>
                      <p className="text-[#AAAAAA]">Selecione um caso com herdeiros para visualizar</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {selectedPerson ? (
              <Card className="border-2 border-[#4169E1]">
                <CardHeader className="bg-blue-50 border-b-2 border-[#4169E1]">
                  <CardTitle className="text-[#333333]">Detalhes da Pessoa</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-[#4169E1] flex items-center justify-center mx-auto mb-3">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-[#333333]">{selectedPerson.nome}</h3>
                    <Badge className="mt-2">{selectedPerson.parentesco}</Badge>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div>
                      <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">CPF</p>
                      <p className="text-sm text-[#333333]">{selectedPerson.cpf || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Email</p>
                      <p className="text-sm text-[#333333]">{selectedPerson.email || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Quota-parte</p>
                      <p className="text-lg font-bold text-[#4169E1]">{selectedPerson.percentual_partilha}%</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-2">Documentos Anexados</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <span className="text-xs text-[#333333]">Documento de Identidade</span>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <span className="text-xs text-[#333333]">Comprovante de Residência</span>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-[#4169E1] hover:bg-[#3151c7] text-white mt-4">
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-slate-200">
                <CardContent className="p-8 text-center">
                  <User className="w-16 h-16 text-[#AAAAAA] mx-auto mb-3" />
                  <p className="text-sm text-[#AAAAAA]">Clique em uma pessoa na árvore para ver detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}