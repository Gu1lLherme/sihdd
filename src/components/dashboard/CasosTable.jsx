import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Eye, FileText } from "lucide-react";

const statusConfig = {
  'coleta_dados': { label: 'Coleta de Dados', color: 'bg-blue-100 text-[#1E40AF]' },
  'calculo_itcmd': { label: 'Cálculo ITCMD', color: 'bg-purple-100 text-purple-700' },
  'geracao_dae': { label: 'Geração DAE', color: 'bg-amber-100 text-[#F59E0B]' },
  'aguardando_pagamento': { label: 'Aguardando Pagamento', color: 'bg-orange-100 text-orange-700' },
  'em_analise_sefaz': { label: 'Análise SEFAZ', color: 'bg-indigo-100 text-indigo-700' },
  'certidao_emitida': { label: 'Certidão Emitida', color: 'bg-emerald-100 text-[#10B981]' },
  'finalizado': { label: 'Finalizado', color: 'bg-green-100 text-green-700' },
};

export default function CasosTable({ casos }) {
  return (
    <Card className="glassmorphism border border-slate-200 card-shadow overflow-hidden">
      <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="text-xl flex items-center gap-3 text-[#0B1A2E]">
          <FileText className="w-6 h-6 text-[#1E40AF]" />
          Lista Completa de Inventários
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-bold text-[#111827]">Falecido</TableHead>
                <TableHead className="font-bold text-[#111827]">Patrimônio</TableHead>
                <TableHead className="font-bold text-[#111827]">ITCMD</TableHead>
                <TableHead className="font-bold text-[#111827]">Status</TableHead>
                <TableHead className="font-bold text-[#111827]">Prazo</TableHead>
                <TableHead className="font-bold text-[#111827] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {casos.map((caso) => {
                const status = statusConfig[caso.status] || statusConfig['coleta_dados'];
                return (
                  <TableRow key={caso.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell className="font-semibold text-[#111827]">{caso.nome_falecido}</TableCell>
                    <TableCell className="text-[#10B981] font-bold">
                      R$ {(caso.valor_patrimonio || 0).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-[#1E40AF] font-bold">
                      R$ {(caso.valor_itcmd || 0).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.color} font-semibold`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#6B7280] font-medium">
                      {caso.prazo_dias ? `${caso.prazo_dias} dias` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
                        <Button variant="outline" size="sm" className="border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white font-semibold transition-all">
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