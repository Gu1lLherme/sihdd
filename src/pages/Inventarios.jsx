import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Eye,
  TrendingUp,
  UserCheck,
  Calculator,
  FileText,
  Trash2,
  Edit
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListaInventariantes from "@/components/inventarios/ListaInventariantes";

const statusConfig = {
  rascunho: { label: "Rascunho", color: "bg-slate-100 text-slate-700", icon: Clock },
  coleta_dados: { label: "Coleta de Dados", color: "bg-blue-100 text-blue-700", icon: Clock },
  calculo_itcmd: { label: "Cálculo ITCMD", color: "bg-indigo-100 text-indigo-700", icon: Calculator },
  geracao_dae: { label: "Geração DAE", color: "bg-purple-100 text-purple-700", icon: FileText },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-amber-100 text-amber-700", icon: Clock },
  em_analise_sefaz: { label: "Em Análise SEFAZ", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  em_analise: { label: "Em Análise", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  certidao_emitida: { label: "Certidão Emitida", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  finalizado: { label: "Finalizado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  concluido: { label: "Concluído", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  pago: { label: "Pago", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
};

// Removed duplicate import

export default function Inventarios() {
  const queryClient = useQueryClient();
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("-created_date");

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Caso.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este inventário?")) {
      deleteMutation.mutate(id);
    }
  };

  const { data: casos, isLoading } = useQuery({
    queryKey: ['casos', ordenacao],
    queryFn: () => base44.entities.Caso.list(ordenacao),
    initialData: [],
  });

  const { data: herdeiros } = useQuery({
    queryKey: ['herdeiros'],
    queryFn: () => base44.entities.Herdeiro.list(),
    initialData: [],
  });

  const { data: bens } = useQuery({
    queryKey: ['bens'],
    queryFn: () => base44.entities.Bem.list(),
    initialData: [],
  });

  // Filtros
  const casosFiltrados = casos.filter(caso => {
    const matchStatus = filtroStatus === "todos" || caso.status === filtroStatus;
    const matchBusca = !filtroBusca || 
      (caso.nome_falecido || caso.falecido_nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
      (caso.numero_caso || caso.numero_processo || '').toLowerCase().includes(filtroBusca.toLowerCase());
    
    return matchStatus && matchBusca;
  });

  // Estatísticas
  const stats = {
    total: casos.length,
    ativos: casos.filter(c => !['finalizado', 'concluido'].includes(c.status)).length,
    finalizados: casos.filter(c => ['finalizado', 'concluido'].includes(c.status)).length,
    patrimonioTotal: casos.reduce((sum, c) => sum + ((c.valor_patrimonio || c.patrimonio_total) || 0), 0),
    itcmdTotal: casos.reduce((sum, c) => sum + ((c.valor_itcmd || c.itcmd_total) || 0), 0),
  };

  const getHerdeirosCount = (casoId) => {
    return herdeiros.filter(h => h.caso_id === casoId).length;
  };

  const getBensCount = (casoId) => {
    return bens.filter(b => b.caso_id === casoId).length;
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FolderOpen className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Inventários</h1>
                <p className="text-slate-600">Acompanhamento detalhado de todos os processos</p>
              </div>
            </div>
            <Link to={createPageUrl("NovoCaso")}>
              <Button className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Novo Inventário
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="casos" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="casos" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                <FolderOpen className="w-4 h-4 mr-2" />
                Lista de Casos
            </TabsTrigger>
            <TabsTrigger value="inventariantes" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900">
                <UserCheck className="w-4 h-4 mr-2" />
                Gestão de Inventariantes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="casos">
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <FolderOpen className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Ativos</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.ativos}</p>
                </div>
                <Clock className="w-10 h-10 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Finalizados</p>
                  <p className="text-3xl font-bold text-green-600">{stats.finalizados}</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Patrimônio</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {stats.patrimonioTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">ITCMD</p>
                  <p className="text-xl font-bold text-purple-600">
                    {stats.itcmdTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="border-slate-200 mb-6 shadow-md">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Buscar Inventário</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    placeholder="Nome do falecido ou nº do caso..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Filtrar por Status</label>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="coleta_dados">Coleta de Dados</SelectItem>
                    <SelectItem value="calculo_itcmd">Cálculo ITCMD</SelectItem>
                    <SelectItem value="geracao_dae">Geração DAE</SelectItem>
                    <SelectItem value="aguardando_pagamento">Aguardando Pagamento</SelectItem>
                    <SelectItem value="em_analise_sefaz">Em Análise SEFAZ</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Ordenar por</label>
                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created_date">Mais Recentes</SelectItem>
                    <SelectItem value="created_date">Mais Antigos</SelectItem>
                    <SelectItem value="-valor_patrimonio">Maior Patrimônio</SelectItem>
                    <SelectItem value="valor_patrimonio">Menor Patrimônio</SelectItem>
                    <SelectItem value="nome_falecido">Nome (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Inventários */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Carregando inventários...</p>
            </div>
          </div>
        ) : casosFiltrados.length === 0 ? (
          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-12 text-center">
              <FolderOpen className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Nenhum inventário encontrado
              </h3>
              <p className="text-slate-500 mb-6">
                {filtroBusca || filtroStatus !== "todos" 
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando seu primeiro inventário"}
              </p>
              {!filtroBusca && filtroStatus === "todos" && (
                <Link to={createPageUrl("NovoCaso")}>
                  <Button className="bg-gradient-to-r from-blue-900 to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Inventário
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {casosFiltrados.map((caso) => {
              const status = statusConfig[caso.status] || statusConfig.coleta_dados;
              const StatusIcon = status.icon;
              
              return (
                <Card key={caso.id} className="border-slate-200 shadow-md hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-md flex-shrink-0">
                            <User className="w-6 h-6 text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                              {caso.nome_falecido || caso.falecido_nome || 'N/A'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={`${status.color} border font-medium`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                              {caso.numero_caso && (
                                <Badge variant="outline" className="text-slate-600">
                                  {caso.numero_caso}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-xs text-slate-500">Patrimônio</p>
                              <p className="font-semibold text-slate-900">
                                {((caso.valor_patrimonio || caso.patrimonio_total) || 0).toLocaleString('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL',
                                  maximumFractionDigits: 0
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-xs text-slate-500">ITCMD</p>
                              <p className="font-semibold text-amber-600">
                                {((caso.valor_itcmd || caso.itcmd_total) || 0).toLocaleString('pt-BR', { 
                                  style: 'currency', 
                                  currency: 'BRL',
                                  maximumFractionDigits: 0
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-xs text-slate-500">Herdeiros</p>
                              <p className="font-semibold text-slate-900">
                                {getHerdeirosCount(caso.id)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-xs text-slate-500">Bens</p>
                              <p className="font-semibold text-slate-900">
                                {getBensCount(caso.id)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {caso.data_obito && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>Óbito: {format(new Date(caso.data_obito), "dd/MM/yyyy", { locale: ptBR })}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {caso.prazo_dias && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-900">
                              {caso.prazo_dias} dias
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Link to={createPageUrl(`DetalheCaso?id=${caso.id}`)} className="flex-1">
                            <Button className="w-full bg-blue-900 hover:bg-blue-800">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </Button>
                          </Link>
                          <Link to={createPageUrl(`NovoCaso?id=${caso.id}`)}>
                             <Button variant="outline" size="icon">
                               <Edit className="w-4 h-4 text-blue-600" />
                             </Button>
                          </Link>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(caso.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
          </TabsContent>

          <TabsContent value="inventariantes">
            <ListaInventariantes />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}