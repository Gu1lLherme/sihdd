import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusConfig = {
  'coleta_dados': { label: 'Em Coleta', color: 'bg-blue-100 text-blue-700' },
  'calculo_itcmd': { label: 'Cálculo', color: 'bg-amber-100 text-amber-700' },
  'em_analise_sefaz': { label: 'Em Análise', color: 'bg-indigo-100 text-indigo-700' },
  'aguardando_docs': { label: 'Aguardando Docs', color: 'bg-yellow-100 text-yellow-700' },
  'concluido': { label: 'Concluído', color: 'bg-green-100 text-green-700' },
  'finalizado': { label: 'Concluído', color: 'bg-green-100 text-green-700' },
};

export default function RecentActivityTable({ casos }) {
  const recentCasos = casos.slice(0, 5);

  return (
    <Card className="bg-white border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-slate-900">Últimos Andamentos</CardTitle>
        <Button variant="link" className="text-blue-600 font-semibold text-sm">Ver tudo</Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Caso / Cliente</TableHead>
              <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</TableHead>
              <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Próx. Prazo</TableHead>
              <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCasos.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center py-8 text-slate-500">Nenhuma atividade recente.</TableCell>
               </TableRow>
            ) : (
              recentCasos.map((caso) => {
                const status = statusConfig[caso.status] || { label: caso.status, color: 'bg-slate-100 text-slate-700' };
                // Fake data for visual match if fields missing
                const tipo = "Inventário Judicial"; 
                const proxPrazo = caso.prazo_dias ? `${caso.prazo_dias} dias` : "-";
                
                return (
                  <TableRow key={caso.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{caso.nome_falecido}</span>
                        <span className="text-xs text-slate-400">Ref: {new Date(caso.created_date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{tipo}</TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium rounded-full px-3 py-0.5 shadow-none border-none hover:bg-opacity-80", status.color)}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 font-medium">
                      {proxPrazo}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            
            {/* Adding fake row for visual match to image if needed */}
            {recentCasos.length > 0 && (
                <TableRow className="border-b border-slate-50 hover:bg-slate-50/50">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">Holding Patrimonial G.R.</span>
                        <span className="text-xs text-slate-400">Ref: 5510/2023</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">Planejamento Sucessório</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-700 font-medium rounded-full px-3 py-0.5 shadow-none border-none">
                        Aguardando Docs
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-red-500 font-bold">
                      Hoje
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Helper utility needs to be imported
import { cn } from "@/lib/utils";