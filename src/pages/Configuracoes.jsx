import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Bell, Eye, EyeOff, Save, Shield, Mail, Phone, MapPin, Briefcase, Palette, Type, History, Filter, Briefcase as CaseIcon, Check, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

const MODULE_LABELS = {
  dashboard: "Dashboard",
  inventarios: "Inventários",
  chat: "IA Jurídica RAG",
  portal: "Portal do Cliente",
  modulos: "Módulos",
  integracoes: "Integrações",
  administracao: "Administração",
  auditoria: "Auditoria",
  relatorios: "Relatórios",
};

export default function Configuracoes() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ['user-settings', user?.email],
    queryFn: async () => {
      const allSettings = await base44.entities.UserSettings.list();
      const userSettings = allSettings.find(s => s.user_email === user?.email);
      
      if (!userSettings) {
        // Criar configurações padrão
        return await base44.entities.UserSettings.create({
        user_email: user?.email,
        sidebar_modules: {
          dashboard: true,
          inventarios: true,
          chat: true,
          portal: true,
          modulos: true,
          integracoes: true,
          administracao: true,
          auditoria: true,
          relatorios: true,
        },
        theme: "light",
        color_scheme: "blue",
        font_family: "inter",
        notifications_enabled: true,
        });
      }
      
      return userSettings;
    },
    enabled: !!user?.email,
  });

  const [moduleSettings, setModuleSettings] = useState({});

  React.useEffect(() => {
    if (settings?.sidebar_modules) {
      setModuleSettings(settings.sidebar_modules);
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings) => {
      return await base44.entities.UserSettings.update(settings.id, newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
    },
  });

  const handleModuleToggle = (moduleKey) => {
    setModuleSettings(prev => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));
  };

  const handleSaveModules = () => {
    updateSettingsMutation.mutate({
      sidebar_modules: moduleSettings
    });
  };

  const handleNotificationToggle = () => {
    updateSettingsMutation.mutate({
      notifications_enabled: !settings?.notifications_enabled
    });
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1A2E] leading-tight">
              Configurações
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[#6B7280] mt-1">
              Gerencie sua conta e preferências
            </p>
          </div>
        </motion.div>

        <Tabs defaultValue="conta" className="space-y-4 sm:space-y-6">
          <TabsList className="glassmorphism border border-slate-200 p-1 h-auto w-full overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="conta" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E40AF] data-[state=active]:to-[#3B82F6] data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Conta
            </TabsTrigger>
            <TabsTrigger 
              value="modulos" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#10B981] data-[state=active]:to-[#059669] data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Módulos
            </TabsTrigger>
            <TabsTrigger 
              value="notificacoes" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F59E0B] data-[state=active]:to-[#D97706] data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger 
              value="aparencia" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger 
              value="casos" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-700 data-[state=active]:to-slate-800 data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <CaseIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Gestão de Casos
            </TabsTrigger>
            <TabsTrigger 
              value="auditoria" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
            >
              <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Auditoria
            </TabsTrigger>
          </TabsList>

          {/* Conta */}
          <TabsContent value="conta" className="space-y-4 sm:space-y-6">
            <Card className="glassmorphism border border-slate-200 card-shadow">
              <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-[#0B1A2E]">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E40AF]" />
                  Informações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-[#1E40AF]/20">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-full flex items-center justify-center shadow-xl flex-shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-[#111827] truncate">{user?.full_name}</h3>
                    <p className="text-xs sm:text-sm text-[#6B7280] truncate">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[#10B981]" />
                      <span className="text-xs sm:text-sm font-semibold text-[#10B981]">
                        {user?.role === 'admin' ? 'Administrador' : 'Advogado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-[#111827]">
                      Nome Completo
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="name"
                        defaultValue={user?.full_name || ''}
                        onChange={(e) => {
                           // Use a ref or state if needed, but for now let's just use onBlur or the button
                           // Actually, let's use a simple approach: update on blur
                        }}
                        onBlur={(e) => {
                            if (e.target.value !== user?.full_name) {
                                base44.auth.updateMe({ full_name: e.target.value });
                                queryClient.invalidateQueries({ queryKey: ['user'] });
                            }
                        }}
                        className="border-2 border-slate-300 text-xs sm:text-sm"
                      />
                      <Button 
                         variant="outline"
                         onClick={() => queryClient.invalidateQueries({ queryKey: ['user'] })}
                         className="shrink-0"
                      >
                         <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-[#111827]">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="border-2 border-slate-300 pl-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs sm:text-sm font-semibold text-[#111827]">
                      Cargo
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                      <Input
                        id="role"
                        value={user?.role === 'admin' ? 'Administrador' : 'Advogado'}
                        disabled
                        className="border-2 border-slate-300 pl-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="created" className="text-xs sm:text-sm font-semibold text-[#111827]">
                      Membro desde
                    </Label>
                    <Input
                      id="created"
                      value={user?.created_date ? new Date(user.created_date).toLocaleDateString('pt-BR') : ''}
                      disabled
                      className="border-2 border-slate-300 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Módulos */}
          <TabsContent value="modulos" className="space-y-4 sm:space-y-6">
            <Card className="glassmorphism border border-slate-200 card-shadow">
              <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-[#0B1A2E]">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981]" />
                  Visibilidade de Módulos
                </CardTitle>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
                  Escolha quais módulos aparecem na barra lateral
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {loadingSettings ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-[#1E40AF] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(MODULE_LABELS).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200 hover:border-[#1E40AF]/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {moduleSettings[key] ? (
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981] flex-shrink-0" />
                          ) : (
                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B7280] flex-shrink-0" />
                          )}
                          <span className="font-semibold text-[#111827] text-sm sm:text-base truncate">
                            {label}
                          </span>
                        </div>
                        <Switch
                          checked={moduleSettings[key] || false}
                          onCheckedChange={() => handleModuleToggle(key)}
                          className="flex-shrink-0"
                        />
                      </div>
                    ))}

                    <Button
                      onClick={handleSaveModules}
                      disabled={updateSettingsMutation.isPending}
                      className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 sm:h-12 font-bold text-sm sm:text-base mt-6"
                    >
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {updateSettingsMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes" className="space-y-4 sm:space-y-6">
            <Card className="glassmorphism border border-slate-200 card-shadow">
              <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-[#0B1A2E]">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#F59E0B]" />
                  Preferências de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-[#F59E0B]/20">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111827] text-sm sm:text-base">Notificações por E-mail</h3>
                      <p className="text-xs sm:text-sm text-[#6B7280]">
                        Receba atualizações sobre seus processos
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings?.notifications_enabled || false}
                    onCheckedChange={handleNotificationToggle}
                    disabled={updateSettingsMutation.isPending}
                  />
                </div>

                <div className="p-4 sm:p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <h4 className="font-bold text-[#111827] mb-2 text-sm sm:text-base">Tipos de Notificações</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#6B7280]">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      Novos documentos recebidos
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      Mudanças de status do processo
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      Prazos próximos ao vencimento
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      Mensagens de clientes
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aparência */}
          <TabsContent value="aparencia" className="space-y-4 sm:space-y-6">
             <Card className="glassmorphism border border-slate-200 card-shadow">
               <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                 <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-[#0B1A2E]">
                   <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                   Personalização Visual
                 </CardTitle>
                 <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
                   Escolha o esquema de cores e a tipografia que mais lhe agrada
                 </p>
               </CardHeader>
               <CardContent className="p-4 sm:p-6 space-y-8">
                 
                 {/* Cores */}
                 <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Palette className="w-4 h-4 text-slate-600" />
                        </div>
                        Esquema de Cores
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {[
                            { id: 'blue', label: 'Azul Royal', color: '#1a237e' },
                            { id: 'gold', label: 'Ouro', color: '#D4AF37' },
                            { id: 'green', label: 'Esmeralda', color: '#10B981' },
                            { id: 'purple', label: 'Roxo', color: '#8B5CF6' },
                            { id: 'slate', label: 'Cinza', color: '#475569' },
                        ].map((scheme) => (
                            <button
                                key={scheme.id}
                                onClick={() => updateSettingsMutation.mutate({ color_scheme: scheme.id })}
                                className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group ${
                                    settings?.color_scheme === scheme.id 
                                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200 ring-offset-2' 
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <div 
                                    className="w-12 h-12 rounded-full shadow-lg mb-2" 
                                    style={{ backgroundColor: scheme.color }}
                                />
                                <span className="text-sm font-medium text-slate-700">{scheme.label}</span>
                                {settings?.color_scheme === scheme.id && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="w-full h-px bg-slate-200" />

                 {/* Fontes */}
                 <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Type className="w-4 h-4 text-slate-600" />
                        </div>
                        Tipografia
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { id: 'inter', label: 'Inter (Padrão)', font: 'Inter, sans-serif' },
                            { id: 'merriweather', label: 'Merriweather (Serif)', font: 'Merriweather, serif' },
                            { id: 'roboto', label: 'Roboto', font: 'Roboto, sans-serif' },
                            { id: 'lato', label: 'Lato', font: 'Lato, sans-serif' },
                            { id: 'system', label: 'Sistema', font: 'system-ui' },
                        ].map((font) => (
                             <button
                                key={font.id}
                                onClick={() => updateSettingsMutation.mutate({ font_family: font.id })}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                    settings?.font_family === font.id
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <span className="text-lg text-slate-800" style={{ fontFamily: font.font }}>
                                    Abc
                                    <span className="text-sm text-slate-500 ml-2 font-normal font-sans">
                                        - {font.label}
                                    </span>
                                </span>
                                {settings?.font_family === font.id && (
                                    <Check className="w-5 h-5 text-blue-600" />
                                )}
                            </button>
                        ))}
                    </div>
                 </div>

               </CardContent>
             </Card>
          </TabsContent>

          {/* Gestão de Casos */}
          <TabsContent value="casos" className="space-y-4 sm:space-y-6">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="glassmorphism border border-slate-200 lg:col-span-1 h-[600px] flex flex-col">
                    <CardHeader className="border-b border-slate-200 bg-slate-50">
                         <CardTitle className="text-lg flex items-center gap-2">
                             <CaseIcon className="w-5 h-5 text-slate-600" />
                             Selecione o Caso
                         </CardTitle>
                         <Input 
                             placeholder="Buscar caso..." 
                             className="mt-2 bg-white" 
                         />
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {casos.map(caso => (
                            <button
                                key={caso.id}
                                onClick={() => setSelectedCase(caso.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    selectedCase === caso.id
                                    ? 'bg-slate-800 text-white border-slate-800'
                                    : 'bg-white hover:bg-slate-50 border-slate-200'
                                }`}
                            >
                                <div className="font-semibold truncate">{caso.nome_falecido}</div>
                                <div className={`text-xs mt-1 truncate ${selectedCase === caso.id ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {caso.numero_caso || 'Sem número'}
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card className="glassmorphism border border-slate-200 lg:col-span-2">
                    <CardHeader className="border-b border-slate-200 bg-slate-50">
                        <CardTitle className="text-lg">
                            {selectedCase 
                                ? `Configurações de: ${casos.find(c => c.id === selectedCase)?.nome_falecido}`
                                : 'Selecione um caso ao lado'
                            }
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!selectedCase ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <CaseIcon className="w-16 h-16 mb-4 opacity-20" />
                                <p>Selecione um caso para personalizar as configurações</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                                    <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-amber-900 text-sm">Personalização Local</h4>
                                        <p className="text-amber-700 text-xs mt-1">
                                            As alterações feitas aqui afetam apenas a visualização deste caso específico, sobrepondo as configurações globais.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 border-b pb-2">Visibilidade de Módulos (Neste Caso)</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {Object.entries(MODULE_LABELS).map(([key, label]) => {
                                            const isGlobalEnabled = settings?.sidebar_modules?.[key] ?? true;
                                            const override = activeCaseSetting?.module_overrides?.[key];
                                            const isEnabled = override !== undefined ? override : isGlobalEnabled;

                                            return (
                                                <div key={key} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                                                    <div className="flex items-center gap-2">
                                                        {isEnabled 
                                                            ? <Eye className="w-4 h-4 text-green-500" />
                                                            : <EyeOff className="w-4 h-4 text-slate-400" />
                                                        }
                                                        <span className="text-sm font-medium text-slate-700">{label}</span>
                                                    </div>
                                                    <Switch 
                                                        checked={isEnabled}
                                                        onCheckedChange={() => handleCaseModuleToggle(key)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                     <h3 className="font-semibold text-slate-900 flex items-center justify-between">
                                         <span>Notificações Específicas</span>
                                         <Badge variant="outline" className="font-normal text-xs">Em breve</Badge>
                                     </h3>
                                     <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-500 text-center italic">
                                         Funcionalidade de notificações granulares por caso será liberada na próxima atualização.
                                     </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
             </div>
          </TabsContent>

          {/* Auditoria */}
          <TabsContent value="auditoria" className="space-y-4 sm:space-y-6">
             <Card className="glassmorphism border border-slate-200 card-shadow">
               <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div>
                        <CardTitle className="text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-[#0B1A2E]">
                        <History className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        Histórico de Auditoria
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                        Rastreabilidade completa de todas as ações no sistema
                        </p>
                     </div>
                     <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                        <Filter className="w-4 h-4 text-slate-400 ml-2" />
                        <select 
                            className="text-sm border-none focus:ring-0 bg-transparent text-slate-600 outline-none"
                            value={auditFilter}
                            onChange={(e) => setAuditFilter(e.target.value)}
                        >
                            <option value="all">Todas as ações</option>
                            <option value="create">Criações</option>
                            <option value="update">Edições</option>
                            <option value="delete">Exclusões</option>
                            <option value="view">Visualizações</option>
                        </select>
                     </div>
                 </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                              <tr>
                                  <th className="px-6 py-3">Data/Hora</th>
                                  <th className="px-6 py-3">Ação</th>
                                  <th className="px-6 py-3">Entidade</th>
                                  <th className="px-6 py-3">Usuário</th>
                                  <th className="px-6 py-3">Detalhes</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {filteredAuditLogs.length === 0 ? (
                                  <tr>
                                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                          Nenhum registro de auditoria encontrado.
                                      </td>
                                  </tr>
                              ) : (
                                  filteredAuditLogs.map((log) => (
                                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                                              {format(new Date(log.created_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                          </td>
                                          <td className="px-6 py-3">
                                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                  log.action_type === 'create' ? 'bg-green-100 text-green-800' :
                                                  log.action_type === 'delete' ? 'bg-red-100 text-red-800' :
                                                  log.action_type === 'update' ? 'bg-blue-100 text-blue-800' :
                                                  'bg-slate-100 text-slate-800'
                                              }`}>
                                                  {log.action_type.toUpperCase()}
                                              </span>
                                          </td>
                                          <td className="px-6 py-3 text-slate-900 font-medium">
                                              {log.entity_type}
                                          </td>
                                          <td className="px-6 py-3 text-slate-600">
                                              {log.user_email}
                                          </td>
                                          <td className="px-6 py-3 text-slate-500 max-w-xs truncate" title={log.action_description}>
                                              {log.action_description}
                                          </td>
                                      </tr>
                                  ))
                              )}
                          </tbody>
                      </table>
                  </div>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}