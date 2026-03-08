import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Pencil, Trash2, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const statusConfig = {
  'coleta_dados': { label: 'Em Coleta', color: 'bg-blue-100 text-blue-700' },
  'calculo_itcmd': { label: 'Cálculo', color: 'bg-amber-100 text-amber-700' },
  'geracao_dae': { label: 'Geração DAE', color: 'bg-purple-100 text-purple-700' },
  'aguardando_pagamento': { label: 'Aguardando Pgto', color: 'bg-orange-100 text-orange-700' },
  'em_analise_sefaz': { label: 'Em Análise', color: 'bg-indigo-100 text-indigo-700' },
  'certidao_emitida': { label: 'Certidão Emitida', color: 'bg-teal-100 text-teal-700' },
  'finalizado': { label: 'Finalizado', color: 'bg-green-100 text-green-700' },
};

function getTipoCaso(caso) {
  const tipo = caso.tipo_inventario === 'judicial' ? 'Judicial' : 'Extrajudicial';
  const processo = caso.tipo_processo === 'sobrepartilha' ? 'Sobrepartilha' : 'Inventário';
  return `${processo} ${tipo}`;
}

function CasoRow({ caso, onDelete }) {
  const status = statusConfig[caso.status] || { label: caso.status, color: 'bg-slate-100 text-slate-700' };
  const proxPrazo = caso.prazo_dias ? `${caso.prazo_dias} dias` : "-";

  return (
    <TableRow className="border-b border-slate-50 hover:bg-slate-50/50">
      <TableCell className="pl-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-sm">{caso.nome_falecido}</span>
          <span className="text-xs text-slate-400">
            {caso.numero_caso || `Ref: ${new Date(caso.created_date).toLocaleDateString()}`}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-slate-600">{getTipoCaso(caso)}</TableCell>
      <TableCell>
        <Badge className={cn("font-medium rounded-full px-3 py-0.5 shadow-none border-none hover:bg-opacity-80", status.color)}>
          {status.label}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-slate-600 font-medium">{proxPrazo}</TableCell>
      <TableCell className="text-right pr-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </DropdownMenuItem>
            </Link>
            <Link to={createPageUrl(`NovoCaso?id=${caso.id}`)}>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => onDelete(caso)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function RecentActivityTable({ casos }) {
  const [showAll, setShowAll] = useState(false);
  const [casoToDelete, setCasoToDelete] = useState(null);
  const recentCasos = casos.slice(0, 5);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.Caso.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      toast.success("Caso excluído com sucesso!");
      setCasoToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao excluir caso.");
    }
  });

  const handleDelete = (caso) => {
    setCasoToDelete(caso);
  };

  const confirmDelete = () => {
    if (casoToDelete) {
      deleteMutation.mutate(casoToDelete.id);
    }
  };

  return (
    <>
      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold text-[#1a237e]">Últimos Andamentos</CardTitle>
          <Button variant="link" className="text-blue-600 font-semibold text-sm" onClick={() => setShowAll(true)}>
            Ver tudo
          </Button>
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
                recentCasos.map((caso) => (
                  <CasoRow key={caso.id} caso={caso} onDelete={handleDelete} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal "Ver tudo" */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAll(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-[#1a237e]">Todos os Casos de Inventário</h2>
                  <p className="text-sm text-slate-500 mt-1">{casos.length} caso(s) encontrado(s)</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowAll(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="overflow-auto flex-1">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-100 hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Caso / Cliente</TableHead>
                      <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</TableHead>
                      <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patrimônio</TableHead>
                      <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prazo</TableHead>
                      <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {casos.map((caso, index) => {
                      const status = statusConfig[caso.status] || { label: caso.status, color: 'bg-slate-100 text-slate-700' };
                      return (
                        <motion.tr
                          key={caso.id}
                          className="border-b border-slate-50 hover:bg-slate-50/50"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[#1a237e]/10 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-[#1a237e]" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-sm">{caso.nome_falecido}</span>
                                <span className="text-xs text-slate-400">{caso.numero_caso || caso.id?.slice(0, 8)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">{getTipoCaso(caso)}</TableCell>
                          <TableCell className="text-sm font-semibold text-slate-700">
                            R$ {(caso.valor_patrimonio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("font-medium rounded-full px-3 py-0.5 shadow-none border-none", status.color)}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 font-medium">
                            {caso.prazo_dias ? `${caso.prazo_dias} dias` : "-"}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)}>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Eye className="w-4 h-4 mr-2" /> Visualizar
                                  </DropdownMenuItem>
                                </Link>
                                <Link to={createPageUrl(`NovoCaso?id=${caso.id}`)}>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Pencil className="w-4 h-4 mr-2" /> Editar
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => handleDelete(caso)}>
                                  <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!casoToDelete} onOpenChange={(open) => !open && setCasoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir caso?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o caso de <strong>{casoToDelete?.nome_falecido}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}