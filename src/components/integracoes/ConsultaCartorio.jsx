
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Home, Search, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { validarMatricula } from "@/utils/validations";

export default function ConsultaCartorio() {
  const [matricula, setMatricula] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const queryClient = useQueryClient();

  const consultaMutation = useMutation({
    mutationFn: async (numeroMatricula) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate API response
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

      // Log integration record using base44 client
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
      setErro(null);
      // Invalidate queries to refresh any lists of integrations if present
      queryClient.invalidateQueries({ queryKey: ['integracoes-consultas'] });
    },
    onError: (error) => {
      console.error("Erro ao consultar cartório:", error);
      setErro("Ocorreu um erro ao realizar a consulta. Tente novamente.");
      setResultado(null);
    }
  });

  const handleConsultar = () => {
    // Trim matrícula input to remove leading/trailing spaces
    const trimmedMatricula = matricula.trim();
    
    // Validate matrícula before initiating mutation
    if (!trimmedMatricula) {
      setErro('Por favor, informe o número da matrícula');
      return;
    }

    const validacao = validarMatricula(trimmedMatricula);
    
    if (!validacao.valido) {
      setErro(validacao.erro);
      return;
    }
    
    setErro(null); // Clear previous errors
    consultaMutation.mutate(trimmedMatricula);
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
              <Label htmlFor="matricula">Número da Matrícula</Label>
              <Input
                id="matricula"
                value={matricula}
                onChange={(e) => {
                  setMatricula(e.target.value);
                  setErro(null); // Clear error when user types
                }}
                placeholder="Ex: 12345"
                className={erro ? 'border-red-500 focus-visible:ring-red-500' : ''}
                aria-invalid={!!erro}
                aria-describedby={erro ? 'matricula-error' : undefined}
              />
              <p className="text-xs text-slate-500">
                Digite o número da matrícula do imóvel no Registro de Imóveis
              </p>
              {erro && (
                <p id="matricula-error" className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {erro}
                </p>
              )}
            </div>

            <Button
              onClick={handleConsultar}
              disabled={consultaMutation.isPending || !matricula.trim()}
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

      {/* Display result card if a result is available */}
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
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs text-slate-600 mb-1">Matrícula</p>
                <p className="text-lg font-bold text-slate-900">{resultado.dados.matricula}</p>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs text-slate-600 mb-1">Endereço</p>
                <p className="text-sm font-medium">{resultado.dados.endereco}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-xs text-slate-600 mb-1">Área</p>
                  <p className="text-sm font-semibold">{resultado.dados.area_m2} m²</p>
                </div>

                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-xs text-slate-600 mb-1">Valor Venal</p>
                  <p className="text-sm font-semibold text-green-600">
                    R$ {resultado.dados.valor_venal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs text-slate-600 mb-1">Proprietário Atual</p>
                <p className="text-sm font-medium">{resultado.dados.proprietario_atual}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-xs text-slate-600 mb-1">Situação</p>
                  <Badge className="bg-green-600 text-white hover:bg-green-600">{resultado.dados.situacao}</Badge>
                </div>

                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-xs text-slate-600 mb-1">IPTU</p>
                  <Badge className={resultado.dados.iptu_em_dia ? "bg-green-600 text-white hover:bg-green-600" : "bg-red-600 text-white hover:bg-red-600"}>
                    {resultado.dados.iptu_em_dia ? "Em dia" : "Pendente"}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs text-slate-600 mb-1">Ônus/Gravames</p>
                <p className="text-sm font-medium">{resultado.dados.onus}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
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
