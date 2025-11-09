import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Eye, FileText } from "lucide-react";

const statusConfig = {
  'coleta_dados': { label: 'Coleta de Dados', color: 'bg-blue-100 text-[#4169E1]' },
  'calculo_itcmd': { label: 'Cálculo ITCMD', color: 'bg-amber-100 text-[#FFC107]' },
  'geracao_dae': { label: 'Geração DAE', color: 'bg-amber-100 text-[#FFC107]' },
  'aguardando_pagamento': { label: 'Aguardando Pagamento', color: 'bg-orange-100 text-orange-700' },
  'em_analise_sefaz': { label: 'Análise SEFAZ', color: 'bg-indigo-100 text-[#4169E1]' },
  'certidao_emitida': { label: 'Certidão Emitida', color: 'bg-emerald-100 text-[#28A745]' },
  'finalizado': { label: 'Finalizado', color: 'bg-green-100 text-green-700' },
};

export default function CasosTable({ casos }) {
  return (
    <Card className="bg-white border-2 border-slate-200 card-shadow overflow-hidden">
      <CardHeader className="border-b-2 border-slate-200 bg-blue-50">
        <CardTitle className="text-xl flex items-center gap-3 text-[#333333]">
          <FileText className="w-6 h-6 text-[#4169E1]" />
          Lista Completa de Inventários
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                <TableHead className="font-bold text-[#333333]">Falecido</TableHead>
                <TableHead className="font-bold text-[#333333]">Patrimônio</TableHead>
                <TableHead className="font-bold text-[#333333]">ITCMD</TableHead>
                <TableHead className="font-bold text-[#333333]">Status</TableHead>
                <TableHead className="font-bold text-[#333333]">Prazo</TableHead>
                <TableHead className="font-bold text-[#333333] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {casos.map((caso) => {
                const status = statusConfig[caso.status] || statusConfig['coleta_dados'];
                return (
                  <TableRow key={caso.id} className="hover:bg-blue-50 transition-colors">
                    <TableCell className="font-semibold text-[#333333]">{caso.nome_falecido}</TableCell>
                    <TableCell className="text-[#FFC107] font-bold">
                      R$ {(caso.valor_patrimonio || 0).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-[#FFC107] font-bold">
                      R$ {(caso.valor_itcmd || 0).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.color} font-semibold`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#AAAAAA] font-medium">
                      {caso.prazo_dias ? `${caso.prazo_dias} dias` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
                        <Button variant="outline" size="sm" className="border-[#4169E1] text-[#4169E1] hover:bg-[#4169E1] hover:text-white font-semibold transition-all">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}