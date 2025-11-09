import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusConfig = {
  coleta_dados: { label: "Coleta de Dados", color: "bg-slate-500" },
  calculo_itcmd: { label: "Cálculo ITCMD", color: "bg-blue-500" },
  geracao_dae: { label: "Geração DAE", color: "bg-indigo-500" },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-amber-500" },
  em_analise_sefaz: { label: "Em Análise SEFAZ", color: "bg-yellow-500" },
  certidao_emitida: { label: "Certidão Emitida", color: "bg-green-500" },
  finalizado: { label: "Finalizado", color: "bg-emerald-500" },
};

export default function CasosTable({ casos }) {
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
                    {caso.nome_falecido}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {caso.valor_patrimonio?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="font-semibold text-amber-600">
                    {caso.valor_itcmd?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${status.color} text-white border-none`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {caso.prazo_dias ? `${caso.prazo_dias} dias` : '—'}
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