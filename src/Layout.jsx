import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Scale, FolderOpen, Link2, History, BarChart3, Brain, Users, Settings, Grid3x3, Shield, Menu, CheckCircle2, Calendar, BookOpen, Gift, HeartCrack } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const ALL_NAVIGATION_ITEMS = [
  {
    key: "dashboard",
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    key: "fato_juridico",
    title: "Fato Jurídico",
    url: createPageUrl("FatoJuridico"),
    icon: Scale,
  },
  {
    key: "integracoes",
    title: "Integrações",
    url: createPageUrl("Integracoes"),
    icon: Link2,
  },
  {
    key: "gestao_prazos",
    title: "Gestão & Prazos",
    icon: Calendar,
    subItems: [
        { key: "tasks", title: "Tarefas", url: createPageUrl("Tasks"), icon: CheckCircle2 },
        { key: "calendar", title: "Calendário", url: createPageUrl("Calendar"), icon: Calendar },
        { key: "portal", title: "Portal do Cliente", url: createPageUrl("PortalCliente"), icon: Shield },
    ]
  },
  {
    key: "inteligencia",
    title: "Inteligência & Ferramentas",
    icon: Brain,
    subItems: [
        { key: "chat", title: "IA Jurídica RAG", url: createPageUrl("ChatAssistente"), icon: Brain },
        { key: "modelagem_partilha", title: "Modelagem", url: createPageUrl("ModelagemPartilha"), icon: Scale },
        { key: "arvore_genealogica", title: "Árvore Genealógica", url: createPageUrl("ArvoreGenealogica"), icon: Users },
    ]
  },
  {
    key: "relatorios_auditoria",
    title: "Relatórios & Auditoria",
    url: createPageUrl("RelatoriosAuditoria"),
    icon: BarChart3,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [showChat, setShowChat] = React.useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const { data: settings } = useQuery({
    queryKey: ['user-settings', user?.email],
    queryFn: async () => {
      const allSettings = await base44.entities.UserSettings.list();
      const userSettings = allSettings.find(s => s.user_email === user?.email);
      
      if (!userSettings) {
        return {
          sidebar_modules: {
            dashboard: true,
            inventarios: true,
            doacoes: true,
            divorcios: true,
            tasks: true,
            calendar: true,
            chat: true,
            portal: true,
            modelagem_partilha: true,
            
            arvore_genealogica: true,
            integracoes: true,
            administracao: true,
            auditoria: true,
            relatorios: true,
            documentacao: true,
          }
        };
      }

      return userSettings;
      },
      enabled: !!user?.email,
      initialData: {
      sidebar_modules: {
        dashboard: true,
        inventarios: true,
        tasks: true,
        calendar: true,
        chat: true,
        portal: true,
        modelagem_partilha: true,
        
        arvore_genealogica: true,
        integracoes: true,
        administracao: true,
        auditoria: true,
        relatorios: true,
        documentacao: true,
      }
      }
  });

  const navigationItems = ALL_NAVIGATION_ITEMS.filter(item => 
    settings?.sidebar_modules?.[item.key] !== false
  );

  return (
    <SidebarProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        :root {
          --royal-blue: #4169E1;
          --gold: #FFC107;
          --white: #FFFFFF;
          --gray-ice: #F5F5F5;
          --gray-dark: #333333;
          --gray-light: #AAAAAA;
          --success: #28A745;
        }

        body {
          background: var(--white);
          overflow-x: hidden;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(65, 105, 225, 0.4); }
          50% { box-shadow: 0 0 30px rgba(65, 105, 225, 0.6), 0 0 40px rgba(255, 193, 7, 0.3); }
        }

        @keyframes slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .nav-item-active {
          background: rgba(255, 255, 255, 0.95) !important;
          color: #4169E1 !important;
          font-weight: 700;
          border-left: 4px solid #FFC107;
        }

        .glassmorphism {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .card-shadow-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-shadow-hover:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform: translateY(-4px);
        }

        @media (max-width: 768px) {
          .animate-float {
            animation: none;
          }
          
          .card-shadow-hover:hover {
            transform: translateY(0);
          }

          svg {
            width: 1rem !important;
            height: 1rem !important;
          }

          .stat-icon svg {
            width: 1.25rem !important;
            height: 1.25rem !important;
          }
        }

        @media (max-width: 640px) {
          .floating-ai-button {
            width: 56px !important;
            height: 56px !important;
            bottom: 20px !important;
            right: 20px !important;
          }
        }

        @media (max-width: 640px) {
          .chat-widget {
            width: calc(100vw - 32px) !important;
            right: 16px !important;
            bottom: 90px !important;
            height: 500px !important;
          }
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-white">
        {/* Sidebar - Fundo Branco */}
        <Sidebar className="border-r-2 border-slate-200 shadow-lg hidden md:flex bg-white">
          <SidebarHeader className="border-b-2 border-slate-200 p-4 lg:p-6 bg-white">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#4169E1] rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                <Scale className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-lg lg:text-xl text-[#333333] tracking-tight truncate">SIHDD</h2>
                <p className="text-[10px] lg:text-xs text-[#AAAAAA] font-medium truncate">Sistema Inteligente</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2 lg:p-3 bg-white">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] lg:text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider px-2 lg:px-3 py-2 mb-1 lg:mb-2 truncate">
                Módulos
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const [isExpanded, setIsExpanded] = React.useState(false);

                    return (
                      <React.Fragment key={item.key}>
                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild={!hasSubItems}
                            onClick={hasSubItems ? () => setIsExpanded(!isExpanded) : undefined}
                            className={`
                              group relative overflow-hidden rounded-lg lg:rounded-xl mb-1
                              transition-all duration-300
                              ${isActive 
                                ? 'nav-item-active' 
                                : 'text-[#333333] hover:bg-slate-100 hover:text-[#4169E1]'
                              }
                            `}
                          >
                            {hasSubItems ? (
                              <div className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-3 min-w-0 cursor-pointer">
                                <div className={`
                                  w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center
                                  transition-all duration-300 flex-shrink-0
                                  ${isActive 
                                    ? 'bg-[#4169E1] scale-110' 
                                    : 'bg-slate-100 group-hover:bg-[#4169E1] group-hover:scale-105'
                                  }
                                `}>
                                  <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive ? 'text-white' : 'text-[#333333] group-hover:text-white'}`} />
                                </div>
                                <span className="flex-1 font-semibold text-sm lg:text-base truncate">{item.title}</span>
                                <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                              </div>
                            ) : (
                              <Link to={item.url} className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-3 min-w-0">
                                <div className={`
                                  w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center
                                  transition-all duration-300 flex-shrink-0
                                  ${isActive 
                                    ? 'bg-[#4169E1] scale-110' 
                                    : 'bg-slate-100 group-hover:bg-[#4169E1] group-hover:scale-105'
                                  }
                                `}>
                                  <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive ? 'text-white' : 'text-[#333333] group-hover:text-white'}`} />
                                </div>
                                <span className="flex-1 font-semibold text-sm lg:text-base truncate">{item.title}</span>
                                {isActive && (
                                  <div className="w-2 h-2 rounded-full bg-[#FFC107] shadow-lg shadow-yellow-500/50 flex-shrink-0" />
                                )}
                              </Link>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        {hasSubItems && isExpanded && item.subItems.map((subItem) => {
                          const isSubActive = location.pathname === subItem.url;
                          return (
                            <SidebarMenuItem key={subItem.key} className="ml-4">
                              <SidebarMenuButton 
                                asChild
                                className={`
                                  group relative overflow-hidden rounded-lg mb-1
                                  transition-all duration-300
                                  ${isSubActive 
                                    ? 'nav-item-active' 
                                    : 'text-[#333333] hover:bg-slate-100 hover:text-[#4169E1]'
                                  }
                                `}
                              >
                                <Link to={subItem.url} className="flex items-center gap-2 px-2 py-2 min-w-0">
                                  <div className={`
                                    w-6 h-6 rounded-lg flex items-center justify-center
                                    transition-all duration-300 flex-shrink-0
                                    ${isSubActive 
                                      ? 'bg-[#4169E1]' 
                                      : 'bg-slate-100 group-hover:bg-[#4169E1]'
                                    }
                                  `}>
                                    <subItem.icon className={`w-3 h-3 ${isSubActive ? 'text-white' : 'text-[#333333] group-hover:text-white'}`} />
                                  </div>
                                  <span className="flex-1 font-semibold text-xs truncate">{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t-2 border-slate-200 p-3 lg:p-4 bg-white">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer group min-w-0 w-full">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#4169E1] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-xs lg:text-sm">
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden text-left">
                    <p className="font-semibold text-[#333333] text-xs lg:text-sm truncate">
                      {user?.full_name?.split(' ')[0] || 'Usuário'}
                    </p>
                    <p className="text-[10px] lg:text-xs text-[#AAAAAA] truncate">Conta & Sistema</p>
                  </div>
                  <Settings className="w-3 h-3 lg:w-4 lg:h-4 text-[#AAAAAA] group-hover:text-[#4169E1] transition-colors flex-shrink-0" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mb-2">
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Configuracoes")} className="cursor-pointer flex items-center">
                     <Settings className="w-4 h-4 mr-2" />
                     Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Administracao")} className="cursor-pointer flex items-center">
                     <Users className="w-4 h-4 mr-2" />
                     Administração
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Integracoes")} className="cursor-pointer flex items-center">
                     <Link2 className="w-4 h-4 mr-2" />
                     Integrações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Documentacao")} className="cursor-pointer flex items-center">
                     <BookOpen className="w-4 h-4 mr-2" />
                     Documentação
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative w-full min-w-0">
          {/* Top Bar */}
          <header className="glassmorphism border-b-2 border-slate-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
                <SidebarTrigger className="md:hidden hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200 flex-shrink-0">
                  <Menu className="w-4 h-4 text-[#333333]" style={{ width: '1rem', height: '1rem' }} />
                </SidebarTrigger>
                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4169E1] rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#333333] leading-tight truncate">SIHDD</h1>
                    <p className="text-[10px] sm:text-xs text-[#AAAAAA] hidden sm:block truncate">Sistema Inteligente</p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Quick Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="md:hidden w-10 h-10 bg-[#4169E1] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Brain className="w-4 h-4 text-white" style={{ width: '1rem', height: '1rem' }} />
                </button>
                <Link to={createPageUrl("Configuracoes")} className="md:hidden">
                  <button className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center shadow-lg">
                    <Settings className="w-4 h-4 text-[#333333]" style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto w-full">
            {children}
          </div>

          {/* Floating IA Button - Azul Royal */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="floating-ai-button hidden md:flex fixed bottom-6 right-6 w-16 h-16 bg-[#4169E1] rounded-full shadow-2xl items-center justify-center hover:scale-110 transition-all duration-300 z-50 animate-float animate-pulse-glow group"
          >
            <Brain className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#28A745] rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* Chat Widget */}
          {showChat && (
            <div className="chat-widget fixed bottom-28 right-6 w-96 h-[600px] glassmorphism rounded-2xl shadow-2xl border-2 border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#4169E1] p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">RAG Tributário</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#28A745] rounded-full animate-pulse flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-white/80 truncate">IA Online</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
                >
                  ✕
                </button>
              </div>
              
              <iframe
                src={createPageUrl("ChatAssistente")}
                className="flex-1 w-full border-0"
                title="RAG Tributário"
              />
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}