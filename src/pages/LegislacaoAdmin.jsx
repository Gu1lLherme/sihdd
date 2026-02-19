import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, FileText, TrendingUp, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function LegislacaoAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("regras");

  // Queries
  const { data: legislacoes = [] } = useQuery({
    queryKey: ['legislacoes'],
    queryFn: () => base44.entities.Legislacao.list('-data_publicacao'),
  });

  const { data: regras = [] } = useQuery({
    queryKey: ['regras_itcmd'],
    queryFn: () => base44.entities.RegraITCMD.list('-data_inicio_vigencia'),
  });

  const { data: historicoUFP = [] } = useQuery({
    queryKey: ['historico_ufp'],
    queryFn: () => base44.entities.HistoricoUFP.list('-ano'),
  });

  // Mutations (Simplified for delete)
  const deleteLegislacao = useMutation({
    mutationFn: (id) => base44.entities.Legislacao.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['legislacoes'])
  });

  const deleteRegra = useMutation({
    mutationFn: (id) => base44.entities.RegraITCMD.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['regras_itcmd'])
  });

  const deleteUFP = useMutation({
    mutationFn: (id) => base44.entities.HistoricoUFP.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['historico_ufp'])
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Base Legislativa & Regras</h1>
          <p className="text-slate-500">Gerencie as leis, alíquotas e valores de UFP para cálculo do ITCMD.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Leis Cadastradas</p>
              <p className="text-2xl font-bold text-blue-900">{legislacoes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-emerald-600 font-medium">Regras de Cálculo</p>
              <p className="text-2xl font-bold text-emerald-900">{regras.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Registros UFP</p>
              <p className="text-2xl font-bold text-purple-900">{historicoUFP.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-6">
          <TabsTrigger value="legislacao">Legislação</TabsTrigger>
          <TabsTrigger value="regras">Regras e Alíquotas</TabsTrigger>
          <TabsTrigger value="ufp">Histórico UFP</TabsTrigger>
        </TabsList>

        {/* Tab Legislação */}
        <TabsContent value="legislacao">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Legislação</CardTitle>
                <CardDescription>Leis e decretos que fundamentam as regras.</CardDescription>
              </div>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" /> Nova Lei
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Publicação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {legislacoes.map((lei) => (
                    <TableRow key={lei.id}>
                      <TableCell className="font-medium">{lei.titulo}</TableCell>
                      <TableCell>{lei.data_publicacao ? format(new Date(lei.data_publicacao), 'dd/MM/yyyy') : '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lei.status === 'vigente' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {lei.status?.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-md truncate" title={lei.descricao}>{lei.descricao}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteLegislacao.mutate(lei.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Regras */}
        <TabsContent value="regras">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Regras de Cálculo</CardTitle>
                <CardDescription>Faixas de valores e alíquotas aplicáveis por período.</CardDescription>
              </div>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" /> Nova Regra
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {regras.map((regra) => (
                  <div key={regra.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            regra.tipo_transmissao === 'causa_mortis' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {regra.tipo_transmissao === 'causa_mortis' ? 'CAUSA MORTIS' : 'DOAÇÃO'}
                          </span>
                          <span className="text-sm text-slate-500">
                            Vigência: {format(new Date(regra.data_inicio_vigencia), 'dd/MM/yyyy')} 
                            {regra.data_fim_vigencia ? ` até ${format(new Date(regra.data_fim_vigencia), 'dd/MM/yyyy')}` : ' (Atual)'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 mt-1">
                          <strong>Bens:</strong> {regra.tipo_bem?.join(', ') || 'Todos'}
                        </p>
                        {regra.condicoes_especiais && (
                          <p className="text-sm text-slate-500 italic mt-1">{regra.condicoes_especiais}</p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteRegra.mutate(regra.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="bg-slate-50 rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-100">
                            <TableHead className="h-8">Min (UFP)</TableHead>
                            <TableHead className="h-8">Max (UFP)</TableHead>
                            <TableHead className="h-8">Alíquota (%)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {regra.faixas?.map((faixa, idx) => (
                            <TableRow key={idx} className="h-8">
                              <TableCell className="py-1">{faixa.min_ufp}</TableCell>
                              <TableCell className="py-1">{faixa.max_ufp || 'Acima'}</TableCell>
                              <TableCell className="py-1 font-bold">{faixa.aliquota}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab UFP */}
        <TabsContent value="ufp">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Unidade Fiscal Padrão (UFP)</CardTitle>
                <CardDescription>Valores históricos da UFP/SE.</CardDescription>
              </div>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" /> Novo Valor
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ano</TableHead>
                    <TableHead>Valor (R$)</TableHead>
                    <TableHead>Período (Mês)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoUFP.map((ufp) => (
                    <TableRow key={ufp.id}>
                      <TableCell className="font-bold">{ufp.ano}</TableCell>
                      <TableCell>R$ {ufp.valor?.toFixed(2)}</TableCell>
                      <TableCell>{ufp.mes_inicio} a {ufp.mes_fim}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteUFP.mutate(ufp.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}