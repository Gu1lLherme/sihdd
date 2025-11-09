import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Filter, Download, Eye, Edit, Trash2, Plus, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const actionTypeConfig = {
  create: { label: "Criação", color: "bg-green-100 text-green-700", icon: Plus },
  update: { label: "Atualização", color: "bg-blue-100 text-blue-700", icon: Edit },
  delete: { label: "Exclusão", color: "bg-red-100 text-red-700", icon: Trash2 },
  view: { label: "Visualização", color: "bg-slate-100 text-slate-700", icon: Eye },
  export: { label: "Exportação", color: "bg-purple-100 text-purple-700", icon: Download },
  integration: { label: "Integração", color: "bg-indigo-100 text-indigo-700", icon: Calendar },
  calculation: { label: "Cálculo", color: "bg-amber-100 text-amber-700", icon: Calendar },
  payment: { label: "Pagamento", color: "bg-emerald-100 text-emerald-700", icon: Calendar },
};

export default function Auditoria() {
  const [filtroTipo, setFiltroTipo] = useState("all");
  const [filtroCaso, setFiltroCaso] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => base44.entities.AuditLog.list("-created_date", 100),
    initialData: [],
  });

  const { data: casos } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list(),
    initialData: [],
  });

  const filteredLogs = logs.filter(log => {
    const tipoMatch = filtroTipo === "all" || log.action_type === filtroTipo;
    const casoMatch = !filtroCaso || log.caso_id === filtroCaso;
    const usuarioMatch = !filtroUsuario || log.user_email?.toLowerCase().includes(filtroUsuario.toLowerCase());
    return tipoMatch && casoMatch && usuarioMatch;
  });

  const exportToCSV = () => {
    const headers = ['Data/Hora', 'Usuário', 'Ação', 'Entidade', 'Descrição'];
    const rows = filteredLogs.map(log => [
      format(new Date(log.created_date), 'dd/MM/yyyy HH:mm:ss'),
      log.user_email,
      actionTypeConfig[log.action_type]?.label || log.action_type,
      log.entity_type,
      log.action_description
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `auditoria_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Trilha de Auditoria</h1>
              <p className="text-slate-600">Registro completo de todas as ações no sistema</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total de Logs</p>
                  <p className="text-2xl font-bold text-blue-900">{logs.length}</p>
                </div>
                <History className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Criações</p>
                  <p className="text-2xl font-bold text-green-600">
                    {logs.filter(l => l.action_type === 'create').length}
                  </p>
                </div>
                <Plus className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Atualizações</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {logs.filter(l => l.action_type === 'update').length}
                  </p>
                </div>
                <Edit className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Integrações</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {logs.filter(l => l.action_type === 'integration').length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-slate-200 mb-6">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tipo de Ação</label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="create">Criação</SelectItem>
                    <SelectItem value="update">Atualização</SelectItem>
                    <SelectItem value="delete">Exclusão</SelectItem>
                    <SelectItem value="view">Visualização</SelectItem>
                    <SelectItem value="export">Exportação</SelectItem>
                    <SelectItem value="integration">Integração</SelectItem>
                    <SelectItem value="calculation">Cálculo</SelectItem>
                    <SelectItem value="payment">Pagamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Caso</label>
                <Select value={filtroCaso} onValueChange={setFiltroCaso}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os casos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Todos os casos</SelectItem>
                    {casos.map((caso) => (
                      <SelectItem key={caso.id} value={caso.id}>
                        {caso.falecido_nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Usuário</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={filtroUsuario}
                    onChange={(e) => setFiltroUsuario(e.target.value)}
                    placeholder="Buscar por email..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={exportToCSV}
                  disabled={filteredLogs.length === 0}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg">
              Registros de Auditoria ({filteredLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Data/Hora</TableHead>
                    <TableHead className="font-semibold">Usuário</TableHead>
                    <TableHead className="font-semibold">Ação</TableHead>
                    <TableHead className="font-semibold">Entidade</TableHead>
                    <TableHead className="font-semibold">Descrição</TableHead>
                    <TableHead className="font-semibold">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
                          <span className="text-slate-500">Carregando logs...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500">Nenhum registro encontrado</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => {
                      const config = actionTypeConfig[log.action_type] || actionTypeConfig.view;
                      const Icon = config.icon;
                      
                      return (
                        <TableRow key={log.id} className="hover:bg-slate-50">
                          <TableCell className="text-sm">
                            {format(new Date(log.created_date), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-400" />
                              <div>
                                <p className="text-sm font-medium">{log.user_name || 'N/A'}</p>
                                <p className="text-xs text-slate-500">{log.user_email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${config.color} border`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-slate-700">
                              {log.entity_type || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-slate-600 truncate">
                              {log.action_description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-mono text-slate-500">
                              {log.ip_address || 'N/A'}
                            </span>
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
      </div>
    </div>
  );
}