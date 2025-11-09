import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Shield, Search, Filter, Edit, Trash2, Eye, UserPlus } from "lucide-react";

export default function Administracao() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const config = {
      admin: { label: 'Administrador', color: 'bg-[#DC2626] text-white' },
      user: { label: 'Advogado', color: 'bg-[#1E40AF] text-white' },
    };
    return config[role] || config.user;
  };

  return (
    <div className="p-4 md:p-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#DC2626] to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B1A2E]">
                Administração de Usuários
              </h1>
              <p className="text-[#6B7280] text-lg">
                Gerenciamento completo de perfis e permissões
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Total</p>
                  <p className="text-3xl font-bold text-[#111827]">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#1E40AF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Admins</p>
                  <p className="text-3xl font-bold text-[#DC2626]">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#DC2626]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Advogados</p>
                  <p className="text-3xl font-bold text-[#1E40AF]">
                    {users.filter(u => u.role === 'user').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#1E40AF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-6">
              <Button className="w-full h-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <UserPlus className="w-5 h-5 mr-2" />
                Novo Usuário
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="glassmorphism border border-slate-200 card-shadow mb-8">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-lg flex items-center gap-2 text-[#0B1A2E]">
              <Filter className="w-5 h-5 text-[#1E40AF]" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <Input
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterRole === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('all')}
                  className={filterRole === 'all' ? 'bg-[#1E40AF]' : ''}
                >
                  Todos
                </Button>
                <Button
                  variant={filterRole === 'admin' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('admin')}
                  className={filterRole === 'admin' ? 'bg-[#DC2626]' : ''}
                >
                  Admins
                </Button>
                <Button
                  variant={filterRole === 'user' ? 'default' : 'outline'}
                  onClick={() => setFilterRole('user')}
                  className={filterRole === 'user' ? 'bg-[#1E40AF]' : ''}
                >
                  Advogados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Usuários */}
        <Card className="glassmorphism border border-slate-200 card-shadow">
          <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="text-xl flex items-center gap-3 text-[#0B1A2E]">
              <Users className="w-6 h-6 text-[#1E40AF]" />
              Lista de Usuários ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-bold text-[#111827]">Nome Completo</TableHead>
                    <TableHead className="font-bold text-[#111827]">E-mail</TableHead>
                    <TableHead className="font-bold text-[#111827]">Papel</TableHead>
                    <TableHead className="font-bold text-[#111827]">Criado em</TableHead>
                    <TableHead className="font-bold text-[#111827] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-6 h-6 border-4 border-[#1E40AF] border-t-transparent rounded-full animate-spin" />
                          <span className="text-[#6B7280]">Carregando usuários...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-[#6B7280]">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const roleBadge = getRoleBadge(user.role);
                      return (
                        <TableRow key={user.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-semibold text-[#111827]">
                            {user.full_name || '-'}
                          </TableCell>
                          <TableCell className="text-[#6B7280]">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={`${roleBadge.color} font-semibold`}>
                              {roleBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#6B7280]">
                            {new Date(user.created_date).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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

        {/* Security Notice */}
        <Card className="glassmorphism border border-[#F59E0B]/20 bg-gradient-to-r from-amber-50 to-orange-50 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#F59E0B] rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827] mb-2">Segurança e Auditoria</h3>
                <p className="text-sm text-[#6B7280]">
                  Todas as ações de gerenciamento de usuários são registradas no log de auditoria. 
                  Apenas administradores podem criar, editar ou remover usuários do sistema. 
                  Autenticação JWT com suporte a 2FA opcional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}