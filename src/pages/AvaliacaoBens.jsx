import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { masks } from "@/components/Masks";
import { TrendingUp, Home, Car, Building2, Upload, ChevronDown, ChevronUp } from "lucide-react";

const TIPO_ICONS = {
  imovel: Home,
  veiculo: Car,
  investimento: TrendingUp,
  empresa: Building2,
};

export default function AvaliacaoBens() {
  const queryClient = useQueryClient();
  const [tipoFiltro, setTipoFiltro] = useState("all");
  const [expandedBem, setExpandedBem] = useState(null);

  const { data: bens, isLoading } = useQuery({
    queryKey: ['bens'],
    queryFn: () => base44.entities.Bem.list("-created_date"),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Bem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bens'] });
    },
  });

  const bensFiltrados = tipoFiltro === "all" 
    ? bens 
    : bens.filter(b => b.tipo === tipoFiltro);

  const totalValor = bensFiltrados.reduce((sum, b) => sum + (b.valor || 0), 0);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFC107] to-[#e6ac00] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Avaliação e Precificação de Bens</h1>
              <p className="text-amber-100 text-sm">Gerencie e avalie os bens do espólio</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <Card className="border-2 border-[#FFC107] mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#AAAAAA] font-bold uppercase mb-1">Valor Total dos Bens</p>
                <p className="text-3xl font-extrabold text-[#FFC107]">
                  R$ {totalValor.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#AAAAAA] font-bold uppercase mb-1">Total de Bens</p>
                <p className="text-3xl font-extrabold text-[#4169E1]">{bensFiltrados.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="border-2 border-slate-200 mb-6">
          <CardHeader className="bg-slate-50 border-b-2 border-slate-200">
            <CardTitle className="text-[#333333]">Filtrar por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={tipoFiltro === "all" ? "default" : "outline"}
                onClick={() => setTipoFiltro("all")}
                className={tipoFiltro === "all" ? "bg-[#4169E1]" : ""}
              >
                Todos os Bens
              </Button>
              <Button
                variant={tipoFiltro === "imovel" ? "default" : "outline"}
                onClick={() => setTipoFiltro("imovel")}
                className={tipoFiltro === "imovel" ? "bg-[#4169E1]" : ""}
              >
                <Home className="w-4 h-4 mr-2" />
                Imóveis
              </Button>
              <Button
                variant={tipoFiltro === "veiculo" ? "default" : "outline"}
                onClick={() => setTipoFiltro("veiculo")}
                className={tipoFiltro === "veiculo" ? "bg-[#4169E1]" : ""}
              >
                <Car className="w-4 h-4 mr-2" />
                Veículos
              </Button>
              <Button
                variant={tipoFiltro === "investimento" ? "default" : "outline"}
                onClick={() => setTipoFiltro("investimento")}
                className={tipoFiltro === "investimento" ? "bg-[#4169E1]" : ""}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Investimentos
              </Button>
              <Button
                variant={tipoFiltro === "empresa" ? "default" : "outline"}
                onClick={() => setTipoFiltro("empresa")}
                className={tipoFiltro === "empresa" ? "bg-[#4169E1]" : ""}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Empresas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Asset List */}
        <div className="space-y-4">
          {bensFiltrados.map((bem) => {
            const Icon = TIPO_ICONS[bem.tipo] || Home;
            const isExpanded = expandedBem === bem.id;

            return (
              <Card key={bem.id} className="border-2 border-slate-200">
                <CardContent className="p-0">
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50"
                    onClick={() => setExpandedBem(isExpanded ? null : bem.id)}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8 text-[#4169E1]" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[#AAAAAA] font-bold uppercase mb-1">Nome do Bem</p>
                        <p className="font-bold text-[#333333]">{bem.descricao}</p>
                        <Badge variant="outline" className="mt-1">{bem.tipo}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-[#AAAAAA] font-bold uppercase mb-1">Valor Declarado</p>
                        <p className="font-bold text-[#333333]">R$ {bem.valor?.toLocaleString('pt-BR') || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#AAAAAA] font-bold uppercase mb-1">Valor de Mercado</p>
                        <p className="font-bold text-[#FFC107]">R$ {bem.valor?.toLocaleString('pt-BR') || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#AAAAAA] font-bold uppercase mb-1">Fonte</p>
                        <Badge className="bg-green-100 text-green-700 border-0">Valor Venal/IPTU</Badge>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#AAAAAA]" /> : <ChevronDown className="w-5 h-5 text-[#AAAAAA]" />}
                  </div>

                  {isExpanded && (
                    <div className="border-t-2 border-slate-200 p-6 bg-slate-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`fonte-${bem.id}`}>Fonte da Avaliação</Label>
                            <Select defaultValue="tax">
                              <SelectTrigger id={`fonte-${bem.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tax">Valor Venal/IPTU</SelectItem>
                                <SelectItem value="fipe">Tabela FIPE</SelectItem>
                                <SelectItem value="broker">Avaliação de Corretor</SelectItem>
                                <SelectItem value="market">Pesquisa de Mercado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {bem.tipo === "veiculo" && (
                            <div>
                              <Label htmlFor={`placa-${bem.id}`}>Placa</Label>
                              <div className="flex gap-2">
                                <Input 
                                  id={`placa-${bem.id}`} 
                                  placeholder="ABC-1234" 
                                  onChange={(e) => e.target.value = masks.plate(e.target.value)}
                                  maxLength={8}
                                />
                                <Button className="bg-[#4169E1] hover:bg-[#3151c7] text-white">
                                  Buscar FIPE
                                </Button>
                              </div>
                            </div>
                          )}

                          <div>
                            <Label htmlFor={`identification-${bem.id}`}>Identificação</Label>
                            <Input
                              id={`identification-${bem.id}`}
                              defaultValue={bem.identificacao}
                              placeholder="Matrícula, placa, conta, etc."
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`upload-${bem.id}`}>Upload do Laudo de Avaliação (PDF)</Label>
                          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#4169E1] cursor-pointer transition-colors">
                            <Upload className="w-12 h-12 text-[#AAAAAA] mx-auto mb-2" />
                            <p className="text-sm text-[#AAAAAA] font-medium">
                              Clique para enviar ou arraste e solte
                            </p>
                            <p className="text-xs text-[#AAAAAA] mt-1">PDF até 10MB</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline">Cancelar</Button>
                        <Button className="bg-[#28A745] hover:bg-[#218838] text-white">
                          Salvar Alterações
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}