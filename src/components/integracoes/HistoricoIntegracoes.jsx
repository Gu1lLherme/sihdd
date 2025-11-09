import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileCheck, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const tipoConfig = {
  sefaz_imovel: { label: "SEFAZ - Imóvel", color: "bg-indigo-100 text-indigo-700" },
  sefaz_veiculo: { label: "SEFAZ - Veículo", color: "bg-indigo-100 text-indigo-700" },
  cartorio_matricula: { label: "Cartório - Matrícula", color: "bg-green-100 text-green-700" },
  detran_veiculo: { label: "DETRAN - Veículo", color: "bg-blue-100 text-blue-700" },
  certidao_negativa: { label: "Certidão Negativa", color: "bg-purple-100 text-purple-700" },
};

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-slate-100 text-slate-700", icon: Clock },
  processando: { label: "Processando", color: "bg-amber-100 text-amber-700", icon: Clock },
  sucesso: { label: "Sucesso", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  erro: { label: "Erro", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function HistoricoIntegracoes({ consultas }) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-900" />
          Histórico de Consultas ({consultas.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Data/Hora</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Parâmetros</TableHead>
                <TableHead className="font-semibold">Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">Nenhuma consulta realizada ainda</p>
                  </TableCell>
                </TableRow>
              ) : (
                consultas.map((consulta) => {
                  const tipo = tipoConfig[consulta.tipo_integracao] || tipoConfig.sefaz_imovel;
                  const status = statusConfig[consulta.status] || statusConfig.pendente;
                  const StatusIcon = status.icon;

                  return (
                    <TableRow key={consulta.id} className="hover:bg-slate-50">
                      <TableCell className="text-sm">
                        {format(new Date(consulta.created_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${tipo.color} border`}>
                          {tipo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${status.color} border`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {consulta.parametros_consulta && (
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {JSON.stringify(consulta.parametros_consulta).slice(0, 50)}...
                          </code>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {consulta.tempo_resposta_ms ? `${consulta.tempo_resposta_ms}ms` : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}