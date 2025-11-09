import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, MessageCircle, Bell, Eye } from "lucide-react";
import { motion } from "framer-motion";

import CaseStatus from "../components/portalcliente/CaseStatus";
import DocumentUpload from "../components/portalcliente/DocumentUpload";
import ChatAdvogado from "../components/portalcliente/ChatAdvogado";
import Notifications from "../components/portalcliente/Notifications";

export default function PortalCliente() {
  const [activeTab, setActiveTab] = useState("casos");

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: casos, isLoading: loadingCasos } = useQuery({
    queryKey: ['casos-cliente', user?.email],
    queryFn: async () => {
      const allCasos = await base44.entities.Caso.list("-created_date");
      return allCasos.filter(c => c.created_by === user?.email);
    },
    initialData: [],
    enabled: !!user?.email,
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      const allNotifications = await base44.entities.AuditLog.list("-created_date", 10);
      return allNotifications.filter(n => n.user_email === user?.email);
    },
    initialData: [],
    enabled: !!user?.email,
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1A2E] leading-tight">
                Portal do Cliente
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#6B7280] mt-1">
                Acompanhe seus processos
              </p>
            </div>
          </motion.div>

          {/* Welcome Card - Mobile Optimized */}
          <Card className="glassmorphism border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 card-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] text-base sm:text-lg mb-1 sm:mb-2">
                    Bem-vindo, {user?.full_name?.split(' ')[0] || 'Cliente'}!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    Portal seguro para acompanhamento. Visualize status, faça upload de documentos e converse com seu advogado.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards - Responsive 2x2 Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full sm:w-auto">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Meus Casos</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#111827]">{casos.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center self-end sm:self-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full sm:w-auto">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Ativos</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#10B981]">
                    {casos.filter(c => c.status !== 'finalizado').length}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center self-end sm:self-center">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full sm:w-auto">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Alertas</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#F59E0B]">{notifications.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center self-end sm:self-center">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border border-slate-200 card-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full sm:w-auto">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">Mensagens</p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#3B82F6]">3</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center self-end sm:self-center">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Mobile Scrollable */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="glassmorphism border border-slate-200 p-1 h-auto w-full overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="casos" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E40AF] data-[state=active]:to-[#3B82F6] data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Casos
            </TabsTrigger>
            <TabsTrigger 
              value="documentos" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#10B981] data-[state=active]:to-[#059669] data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Docs
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="notificacoes" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F59E0B] data-[state=active]:to-[#D97706] data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Alertas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="casos" className="space-y-4 sm:space-y-6">
            <CaseStatus casos={casos} isLoading={loadingCasos} />
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4 sm:space-y-6">
            <DocumentUpload casos={casos} userEmail={user?.email} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4 sm:space-y-6">
            <ChatAdvogado userEmail={user?.email} userName={user?.full_name} />
          </TabsContent>

          <TabsContent value="notificacoes" className="space-y-4 sm:space-y-6">
            <Notifications notifications={notifications} />
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <Card className="glassmorphism border border-[#10B981]/20 bg-gradient-to-r from-emerald-50 to-green-50 mt-6 sm:mt-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#10B981] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#111827] mb-1 sm:mb-2 text-sm sm:text-base">Segurança e Privacidade</h3>
                <p className="text-xs sm:text-sm text-[#6B7280]">
                  🔒 Todas as informações são protegidas com criptografia ponta a ponta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}