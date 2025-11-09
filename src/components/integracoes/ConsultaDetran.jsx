
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Car, Search, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { validarPlaca, formatarPlaca } from "../../utils/validations";

export default function ConsultaDetran() {
  const [placa, setPlaca] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const queryClient = useQueryClient();

  const consultaMutation = useMutation({
    mutationFn: async (placaVeiculo) => {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const resultadoConsulta = {
        status: "sucesso",
        dados: {
          placa: placaVeiculo.toUpperCase(),
          marca: "Volkswagen",
          modelo: "Gol 1.0",
          ano_fabricacao: 2020,
          ano_modelo: 2021,
          cor: "Prata",
          chassi: "9BWAA05U7KP012345",
          renavam: "00987654321",
          proprietario: "João da Silva",
          situacao: "Regular",
          ipva_em_dia: true,
          licenciamento_em_dia: true,
          multas_pendentes: 0,
          valor_fipe: 50000,
          data_consulta: new Date().toISOString().split('T')[0],
        }
      };

      await base44.entities.IntegracaoConsulta.create({
        tipo_integracao: "detran_veiculo",
        parametros_consulta: { placa: placaVeiculo },
        status: "sucesso",
        resultado: resultadoConsulta,
        tempo_resposta_ms: 1500,
      });

      return resultadoConsulta;
    },
    onSuccess: (data) => {
      setResultado(data);
      setErro(null);
      queryClient.invalidateQueries({ queryKey: ['integracoes-consultas'] });
    },
  });

  const handleConsultar = () => {
    // Validar placa antes de consultar
    const validacao = validarPlaca(placa);
    
    if (!validacao.valido) {
      setErro(validacao.erro);
      return;
    }
    
    if (!placa.trim()) {
      setErro('Por favor, informe a placa do veículo');
      return;
    }
    
    setErro(null);
    consultaMutation.mutate(placa);
  };

  const handlePlacaChange = (value) => {
    const placaFormatada = formatarPlaca(value);
    setPlaca(placaFormatada);
    setErro(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-600" />
            Consulta DETRAN - Veículos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="placa">Placa do Veículo</Label>
              <Input
                id="placa"
                value={placa}
                onChange={(e) => handlePlacaChange(e.target.value)}
                placeholder="Ex: ABC-1234"
                maxLength={8}
                className={erro ? 'border-red-500' : ''}
              />
              <p className="text-xs text-slate-500">
                Digite a placa do veículo (formato antigo ou Mercosul)
              </p>
              {erro && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {erro}
                </p>
              )}
            </div>

            <Button
              onClick={handleConsultar}
              disabled={consultaMutation.isPending || !placa}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {consultaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando DETRAN...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Consultar Veículo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {resultado && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Dados do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Placa</p>
                <p className="text-lg font-bold text-slate-900">{resultado.dados.placa}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Marca</p>
                  <p className="text-sm font-semibold">{resultado.dados.marca}</p>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Modelo</p>
                  <p className="text-sm font-semibold">{resultado.dados.modelo}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Ano Fab.</p>
                  <p className="text-sm font-semibold">{resultado.dados.ano_fabricacao}</p>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Ano Modelo</p>
                  <p className="text-sm font-semibold">{resultado.dados.ano_modelo}</p>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Cor</p>
                  <p className="text-sm font-semibold">{resultado.dados.cor}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Chassi</p>
                <p className="text-sm font-mono">{resultado.dados.chassi}</p>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">RENAVAM</p>
                <p className="text-sm font-mono">{resultado.dados.renavam}</p>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Proprietário</p>
                <p className="text-sm font-medium">{resultado.dados.proprietario}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">IPVA</p>
                  <Badge className={resultado.dados.ipva_em_dia ? "bg-green-600" : "bg-red-600"}>
                    {resultado.dados.ipva_em_dia ? "Em dia" : "Pendente"}
                  </Badge>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Licenciamento</p>
                  <Badge className={resultado.dados.licenciamento_em_dia ? "bg-green-600" : "bg-red-600"}>
                    {resultado.dados.licenciamento_em_dia ? "Em dia" : "Vencido"}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Valor FIPE</p>
                <p className="text-lg font-bold text-blue-600">
                  R$ {resultado.dados.valor_fipe.toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Situação:</strong> {resultado.dados.situacao}<br/>
                  <strong>Multas Pendentes:</strong> {resultado.dados.multas_pendentes}<br/>
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
