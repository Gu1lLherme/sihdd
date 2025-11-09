import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ConsultaSEFAZ() {
  const [tipoConsulta, setTipoConsulta] = useState("aliquota");
  const [valorPatrimonio, setValorPatrimonio] = useState("");
  const [resultado, setResultado] = useState(null);
  const queryClient = useQueryClient();

  const consultaMutation = useMutation({
    mutationFn: async (params) => {
      // Simulação de consulta à SEFAZ
      await new Promise(resolve => setTimeout(resolve, 2000));

      let resultadoConsulta = {};

      if (params.tipo === "aliquota") {
        const valor = parseFloat(params.valor);
        resultadoConsulta = {
          status: "sucesso",
          dados: {
            aliquota: valor <= 2000000 ? 4 : 6,
            faixa_valor: valor <= 2000000 ? "Até R$ 2.000.000" : "Acima de R$ 2.000.000",
            itcmd_calculado: valor * (valor <= 2000000 ? 0.04 : 0.06),
            legislacao: "Lei Estadual nº 3.288/1987 e Decreto nº 20.797/2002",
            observacoes: "Consulta realizada com sucesso na base da SEFAZ/SE",
          }
        };
      } else if (params.tipo === "certidao") {
        resultadoConsulta = {
          status: "sucesso",
          dados: {
            certidao_disponivel: true,
            numero_certidao: `CN-${Date.now()}`,
            data_emissao: new Date().toISOString().split('T')[0],
            validade_dias: 30,
            observacoes: "Certidão Negativa de Débitos Estaduais emitida com sucesso",
          }
        };
      }

      // Registrar no histórico
      await base44.entities.IntegracaoConsulta.create({
        tipo_integracao: "sefaz_imovel",
        parametros_consulta: params,
        status: "sucesso",
        resultado: resultadoConsulta,
        tempo_resposta_ms: 2000,
      });

      return resultadoConsulta;
    },
    onSuccess: (data) => {
      setResultado(data);
      queryClient.invalidateQueries({ queryKey: ['integracoes-consultas'] });
    },
  });

  const handleConsultar = () => {
    consultaMutation.mutate({
      tipo: tipoConsulta,
      valor: valorPatrimonio,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Consulta SEFAZ/SE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Consulta</Label>
              <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aliquota">Consulta de Alíquota ITCMD</SelectItem>
                  <SelectItem value="certidao">Emissão de Certidão Negativa</SelectItem>
                  <SelectItem value="debitos">Consulta de Débitos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipoConsulta === "aliquota" && (
              <div className="space-y-2">
                <Label>Valor do Patrimônio (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={valorPatrimonio}
                  onChange={(e) => setValorPatrimonio(e.target.value)}
                  placeholder="1000000.00"
                />
              </div>
            )}

            <Button
              onClick={handleConsultar}
              disabled={consultaMutation.isPending || (!valorPatrimonio && tipoConsulta === "aliquota")}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {consultaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando SEFAZ/SE...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Consultar
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
              Resultado da Consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {resultado.dados.aliquota && (
                <>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Alíquota Aplicável</span>
                    <Badge className="bg-indigo-600 text-white">{resultado.dados.aliquota}%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Faixa de Valor</span>
                    <span className="text-sm font-semibold">{resultado.dados.faixa_valor}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium text-slate-700">ITCMD Calculado</span>
                    <span className="text-lg font-bold text-indigo-600">
                      R$ {resultado.dados.itcmd_calculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Legislação Aplicada</p>
                    <p className="text-sm font-medium">{resultado.dados.legislacao}</p>
                  </div>
                </>
              )}

              {resultado.dados.certidao_disponivel && (
                <>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Número da Certidão</span>
                    <span className="text-sm font-mono font-semibold">{resultado.dados.numero_certidao}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Data de Emissão</span>
                    <span className="text-sm font-semibold">
                      {new Date(resultado.dados.data_emissao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Validade</span>
                    <span className="text-sm font-semibold">{resultado.dados.validade_dias} dias</span>
                  </div>
                </>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Observações:</strong> {resultado.dados.observacoes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}