import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, BarChart3, Users, Shield, Link2, Settings, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const MODULOS = [
  {
    id: 'rag',
    nome: 'RAG Tributário 2020-2025',
    descricao: 'Inteligência artificial especializada em legislação tributária de Sergipe',
    icon: Brain,
    gradient: 'from-[#0B1A2E] via-[#1E40AF] to-[#3B82F6]',
    funcoes: ['Consulta legislação ITCMD', 'Geração de pareceres', 'Cálculos automáticos', 'Validação de documentos'],
    ativo: true,
  },
  {
    id: 'documental',
    nome: 'Jurídico-Documental',
    descricao: 'Geração automática de documentos jurídicos e certidões',
    icon: FileText,
    gradient: 'from-[#F59E0B] via-[#D97706] to-[#B45309]',
    funcoes: ['Geração de ITCMD', 'Certidões automáticas', 'Relatórios jurídicos', 'Preview 3D'],
    ativo: true,
  },
  {
    id: 'relatorios',
    nome: 'Relatórios e Analytics',
    descricao: 'Dashboards interativos e exportação de dados',
    icon: BarChart3,
    gradient: 'from-[#10B981] via-[#059669] to-[#047857]',
    funcoes: ['Gráficos dinâmicos', 'Exportação PDF/CSV/XLSX', 'Filtros avançados', 'Analytics em tempo real'],
    ativo: true,
  },
  {
    id: 'integracoes',
    nome: 'Integrações Oficiais',
    descricao: 'Conexão com SEFAZ, Cartórios e DETRAN',
    icon: Link2,
    gradient: 'from-purple-600 via-purple-500 to-purple-400',
    funcoes: ['SEFAZ/SE API', 'Cartórios digitais', 'DETRAN consultas', 'Histórico completo'],
    ativo: true,
  },
  {
    id: 'portal',
    nome: 'Portal do Cliente',
    descricao: 'Acesso seguro para clientes acompanharem processos',
    icon: Users,
    gradient: 'from-cyan-600 via-cyan-500 to-cyan-400',
    funcoes: ['Dashboard cliente', 'Upload de documentos', 'Chat seguro', 'Notificações'],
    ativo: false,
  },
  {
    id: 'auditoria',
    nome: 'Auditoria e Compliance',
    descricao: 'Rastreamento completo de ações e conformidade',
    icon: Shield,
    gradient: 'from-red-600 via-red-500 to-red-400',
    funcoes: ['Log de auditoria', 'Controle de acesso', 'Relatórios de compliance', 'Backup automático'],
    ativo: true,
  },
];

export default function Modulos() {
  const [modulos, setModulos] = useState(MODULOS);

  const toggleModulo = (id) => {
    setModulos(prev => prev.map(m => 
      m.id === id ? { ...m, ativo: !m.ativo } : m
    ));
  };

  return (
    <div className="p-4 md:p-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B1A2E]">
                Módulos Inteligentes
              </h1>
              <p className="text-[#6B7280] text-lg">
                Arquitetura modular com ativação/desativação sob demanda
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Total de Módulos</p>
                  <p className="text-3xl font-bold text-[#111827]">{modulos.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-[#1E40AF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Módulos Ativos</p>
                  <p className="text-3xl font-bold text-[#10B981]">{modulos.filter(m => m.ativo).length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Módulos Inativos</p>
                  <p className="text-3xl font-bold text-[#6B7280]">{modulos.filter(m => !m.ativo).length}</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-[#6B7280]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Módulos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((modulo, index) => {
            const Icon = modulo.icon;
            return (
              <motion.div
                key={modulo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`
                  glassmorphism border-2 card-shadow-hover overflow-hidden relative group h-full
                  ${modulo.ativo ? 'border-[#10B981]' : 'border-slate-200'}
                `}>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className={`
                      font-bold text-xs
                      ${modulo.ativo 
                        ? 'bg-[#10B981] text-white border-[#10B981]' 
                        : 'bg-slate-200 text-[#6B7280] border-slate-300'
                      }
                    `}>
                      {modulo.ativo ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1 inline" />ATIVO</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1 inline" />INATIVO</>
                      )}
                    </Badge>
                  </div>

                  {/* Icon Header com Gradiente */}
                  <div className={`bg-gradient-to-br ${modulo.gradient} p-6 relative`}>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                      <Icon className="w-9 h-9 text-white" />
                    </div>
                  </div>

                  <CardHeader className="border-b border-slate-200 pb-4">
                    <CardTitle className="text-lg font-bold text-[#0B1A2E]">
                      {modulo.nome}
                    </CardTitle>
                    <p className="text-sm text-[#6B7280] mt-2">
                      {modulo.descricao}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="space-y-3 mb-6">
                      <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Funcionalidades:</p>
                      {modulo.funcoes.map((funcao, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                          <p className="text-sm text-[#111827]">{funcao}</p>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => toggleModulo(modulo.id)}
                      className={`
                        w-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl
                        ${modulo.ativo 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                          : 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white'
                        }
                      `}
                    >
                      {modulo.ativo ? (
                        <><XCircle className="w-4 h-4 mr-2" />Desativar Módulo</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4 mr-2" />Ativar Módulo</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Footer */}
        <Card className="glassmorphism border border-[#F59E0B]/20 bg-gradient-to-r from-amber-50 to-orange-50 mt-10">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#F59E0B] rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827] mb-2">Controle Administrativo</h3>
                <p className="text-sm text-[#6B7280]">
                  Apenas usuários com permissão de <strong>Administrador</strong> podem ativar, desativar ou gerenciar módulos do sistema. 
                  Todas as alterações são registradas no log de auditoria com rastreamento completo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}