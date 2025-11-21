import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, ChevronDown, ChevronUp } from "lucide-react";
import { masks } from "@/components/Masks";

export default function ListaBens({ bens, expandedBem, setExpandedBem, TIPO_ICONS, Home }) {
  return (
    <div className="space-y-4">
      {bens.map((bem) => {
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
  );
}