import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Home, Search, CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ConsultaCartorio() {
  const [matricula, setMatricula] = useState("");
  const [resultado, setResultado] = useState(null);
  const queryClient = useQueryClient();

  const consultaMutation = useMutation({
    mutationFn: async (numeroMatricula) => {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const resultadoConsulta = {
        status: "sucesso",
        dados: {
          matricula: numeroMatricula,
          endereco: "Rua Principal, nº 123 - Centro, Aracaju/SE",
          area_m2: 250,
          valor_venal: 800000,
          proprietario_atual: "João da Silva",
          situacao: "Regular",
          onus: "Nenhum",
          iptu_em_dia: true,
          cartorio: "1º Registro de Imóveis de Aracaju",
          data_consulta: new Date().toISOString().split('T')[0],
        }
      };

      await base44.entities.IntegracaoConsulta.create({
        tipo_integracao: "cartorio_matricula",
        parametros_consulta: { matricula: numeroMatricula },
        status: "sucesso",
        resultado: resultadoConsulta,
        tempo_resposta_ms: 1500,
      });

      return resultadoConsulta;
    },
    onSuccess: (data) => {
      setResultado(data);
      queryClient.invalidateQueries({ queryKey: ['integracoes-consultas'] });
    },
  });

  const handleConsultar = () => {
    consultaMutation.mutate(matricula);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2">
            <Home className="w-5 h-5 text-green-600" />
            Consulta de Matrícula - Cartório de Imóveis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Número da Matrícula</Label>
              <Input
                value={matricula}
                onChange={(e) => setMatricula(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 12345"
              />
              <p className="text-xs text-slate-500">
                Digite o número da matrícula do imóvel no Registro de Imóveis
              </p>
            </div>

            <Button
              onClick={handleConsultar}
              disabled={consultaMutation.isPending || !matricula}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {consultaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando Cartório...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Consultar Matrícula
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {resultado && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="text-lg flex items-center gap-2 text-green-900">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Dados do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Matrícula</p>
                <p className="text-lg font-bold text-slate-900">{resultado.dados.matricula}</p>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Endereço</p>
                <p className="text-sm font-medium">{resultado.dados.endereco}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Área</p>
                  <p className="text-sm font-semibold">{resultado.dados.area_m2} m²</p>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Valor Venal</p>
                  <p className="text-sm font-semibold text-green-600">
                    R$ {resultado.dados.valor_venal.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Proprietário Atual</p>
                <p className="text-sm font-medium">{resultado.dados.proprietario_atual}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Situação</p>
                  <Badge className="bg-green-600 text-white">{resultado.dados.situacao}</Badge>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">IPTU</p>
                  <Badge className={resultado.dados.iptu_em_dia ? "bg-green-600" : "bg-red-600"}>
                    {resultado.dados.iptu_em_dia ? "Em dia" : "Pendente"}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Ônus/Gravames</p>
                <p className="text-sm font-medium">{resultado.dados.onus}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Cartório:</strong> {resultado.dados.cartorio}<br/>
                  <strong>Data da Consulta:</strong> {new Date(resultado.dados.data_consulta).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}