import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  HeartCrack, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  User,
  Eye,
  Scale,
  Trash2,
  Edit
} from "lucide-react";
import { masks } from "@/components/Masks";

const statusConfig = {
  rascunho: { label: "Rascunho", color: "bg-slate-100 text-slate-700", icon: Clock },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-amber-100 text-amber-700", icon: Clock },
  concluido: { label: "Concluído", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
};

const regimeLabels = {
  uniao_estavel: "União Estável",
  comunhao_universal: "Comunhão Universal",
  comunhao_parcial: "Comunhão Parcial",
  separacao_total: "Separação Total",
  participacao_final: "Part. Final Aquestos"
};

import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function Divorcios() {
  const queryClient = useQueryClient();
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("-created_date");

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Divorcio.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divorcios'] });
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este divórcio?")) {
      deleteMutation.mutate(id);
    }
  };

  const { data: divorcios, isLoading } = useQuery({
    queryKey: ['divorcios', ordenacao],
    queryFn: () => base44.entities.Divorcio.list(ordenacao),
    initialData: [],
  });

  // Filtros
  const divorciosFiltrados = divorcios.filter(divorcio => {
    const matchStatus = filtroStatus === "todos" || divorcio.status === filtroStatus;
    const matchBusca = !filtroBusca || 
      (divorcio.conjuge_doador_nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
      (divorcio.conjuge_donatario_nome || '').toLowerCase().includes(filtroBusca.toLowerCase());
    
    return matchStatus && matchBusca;
  });

  // Estatísticas
  const stats = {
    total: divorcios.length,
    ativos: divorcios.filter(d => d.status !== 'concluido').length,
    concluidos: divorcios.filter(d => d.status === 'concluido').length,
    tributoTotal: divorcios.reduce((sum, d) => sum + (d.valor_tributo || 0), 0),
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                <HeartCrack className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#333333]">Divórcios</h1>
                <p className="text-slate-600">Excesso de Meação e ITCMD</p>
              </div>
            </div>
            <Link to={createPageUrl("NovoDivorcio")}>
              <Button className="bg-[#4169E1] hover:bg-[#3151c7] text-white shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Novo Divórcio
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <HeartCrack className="w-10 h-10 text-purple-600 opacity-20" />
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
                  <p className="text-sm text-slate-600 mb-1">Concluídos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.concluidos}</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">ITCMD Total</p>
                  <p className="text-xl font-bold text-purple-600">
                    {stats.tributoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
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
                <label className="text-sm font-medium text-slate-700">Buscar Divórcio</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    placeholder="Nome dos cônjuges..."
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
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="aguardando_pagamento">Aguardando Pagamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
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
                    <SelectItem value="-valor_excesso_meacao">Maior Excesso</SelectItem>
                    <SelectItem value="valor_excesso_meacao">Menor Excesso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Divórcios */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Carregando divórcios...</p>
            </div>
          </div>
        ) : divorciosFiltrados.length === 0 ? (
          <Card className="border-slate-200 shadow-md">
            <CardContent className="p-12 text-center">
              <HeartCrack className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Nenhum divórcio encontrado
              </h3>
              <p className="text-slate-500 mb-6">
                {filtroBusca || filtroStatus !== "todos" 
                  ? "Tente ajustar os filtros de busca"
                  : "Comece cadastrando seu primeiro divórcio"}
              </p>
              {!filtroBusca && filtroStatus === "todos" && (
                <Link to={createPageUrl("NovoDivorcio")}>
                  <Button className="bg-[#4169E1] hover:bg-[#3151c7]">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Divórcio
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {divorciosFiltrados.map((divorcio) => {
              const status = statusConfig[divorcio.status] || statusConfig.rascunho;
              const StatusIcon = status.icon;
              
              return (
                <Card key={divorcio.id} className="border-slate-200 shadow-md hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shadow-md flex-shrink-0">
                            <HeartCrack className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                              {divorcio.conjuge_doador_nome} <span className="text-slate-400 mx-2">&</span> {divorcio.conjuge_donatario_nome}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={`${status.color} border font-medium`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                              {divorcio.regime_bens && (
                                <Badge variant="outline" className="text-slate-600 border-purple-200 bg-purple-50">
                                  <Scale className="w-3 h-3 mr-1" />
                                  {regimeLabels[divorcio.regime_bens] || divorcio.regime_bens}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-xs text-slate-500">Excesso Meação</p>
                              <p className="font-semibold text-slate-900">
                                {masks.currency((divorcio.valor_excesso_meacao || 0) * 100)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <div>
                              <p className="text-xs text-slate-500">Tributo</p>
                              <p className="font-semibold text-purple-600">
                                {masks.currency((divorcio.valor_tributo || 0) * 100)}
                              </p>
                            </div>
                          </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                            <Link to={createPageUrl(`NovoDivorcio?id=${divorcio.id}`)}>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                </Button>
                            </Link>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(divorcio.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
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
      </div>
    </div>
  );
}