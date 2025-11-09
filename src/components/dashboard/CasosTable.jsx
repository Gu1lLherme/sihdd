import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusConfig = {
  rascunho: { label: "Rascunho", color: "bg-slate-100 text-slate-700" },
  coleta_dados: { label: "Coleta de Dados", color: "bg-slate-500 text-white" },
  calculo_itcmd: { label: "Cálculo ITCMD", color: "bg-blue-500 text-white" },
  geracao_dae: { label: "Geração DAE", color: "bg-indigo-500 text-white" },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-amber-500 text-white" },
  em_analise_sefaz: { label: "Em Análise SEFAZ", color: "bg-yellow-500 text-white" },
  certidao_emitida: { label: "Certidão Emitida", color: "bg-green-500 text-white" },
  finalizado: { label: "Finalizado", color: "bg-emerald-500 text-white" },
  em_analise: { label: "Em Análise", color: "bg-amber-500 text-white" },
  pago: { label: "Pago", color: "bg-blue-500 text-white" },
  concluido: { label: "Concluído", color: "bg-emerald-500 text-white" },
};

export default function CasosTable({ casos }) {
  if (!casos || casos.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white border-none shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
              <TableHead className="font-semibold text-[#1e3a5f]">Falecido</TableHead>
              <TableHead className="font-semibold text-[#1e3a5f]">Patrimônio</TableHead>
              <TableHead className="font-semibold text-[#1e3a5f]">ITCMD</TableHead>
              <TableHead className="font-semibold text-[#1e3a5f]">Status</TableHead>
              <TableHead className="font-semibold text-[#1e3a5f]">Prazo</TableHead>
              <TableHead className="font-semibold text-[#1e3a5f]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {casos.map((caso) => {
              const status = statusConfig[caso.status] || statusConfig.coleta_dados;
              return (
                <TableRow 
                  key={caso.id} 
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <TableCell className="font-medium text-[#1e3a5f]">
                    {caso.nome_falecido || caso.falecido_nome || 'N/A'}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {((caso.valor_patrimonio || caso.patrimonio_total) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="font-semibold text-amber-600">
                    {((caso.valor_itcmd || caso.itcmd_total) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${status.color} border-none`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {caso.prazo_dias ? `${caso.prazo_dias} dias` : '30 dias'}
                  </TableCell>
                  <TableCell>
                    <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
                      <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}