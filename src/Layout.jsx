import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Scale, FolderOpen, Link2, History, BarChart3, Brain, Users, Settings, Grid3x3, Shield, Menu } from "lucide-react";
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

const ALL_NAVIGATION_ITEMS = [
  {
    key: "dashboard",
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    key: "inventarios",
    title: "Inventários",
    url: createPageUrl("Inventarios"),
    icon: FolderOpen,
  },
  {
    key: "chat",
    title: "IA Jurídica RAG",
    url: createPageUrl("ChatAssistente"),
    icon: Brain,
  },
  {
    key: "portal",
    title: "Portal do Cliente",
    url: createPageUrl("PortalCliente"),
    icon: Shield,
  },
  {
    key: "modulos",
    title: "Módulos",
    url: createPageUrl("Modulos"),
    icon: Grid3x3,
  },
  {
    key: "integracoes",
    title: "Integrações",
    url: createPageUrl("Integracoes"),
    icon: Link2,
  },
  {
    key: "administracao",
    title: "Administração",
    url: createPageUrl("Administracao"),
    icon: Users,
  },
  {
    key: "auditoria",
    title: "Auditoria",
    url: createPageUrl("Auditoria"),
    icon: History,
  },
  {
    key: "relatorios",
    title: "Relatórios",
    url: createPageUrl("Relatorios"),
    icon: BarChart3,
  },
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
            chat: true,
            portal: true,
            modulos: true,
            integracoes: true,
            administracao: true,
            auditoria: true,
            relatorios: true,
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
        chat: true,
        portal: true,
        modulos: true,
        integracoes: true,
        administracao: true,
        auditoria: true,
        relatorios: true,
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
          --primary-navy: #1A237E;
          --primary-royal: #4169E1;
          --accent-gold: #FFD700;
          --accent-gold-soft: #FFC107;
          --bg-main: #F5F7FA;
          --text-primary: #333333;
          --text-secondary: #6B7280;
          --white: #FFFFFF;
          --success: #10B981;
          --warning: #F59E0B;
          --error: #DC2626;
        }

        body {
          background: var(--bg-main);
          overflow-x: hidden;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(65, 105, 225, 0.4); }
          50% { box-shadow: 0 0 30px rgba(65, 105, 225, 0.6), 0 0 40px rgba(255, 215, 0, 0.3); }
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
          background: linear-gradient(90deg, rgba(65, 105, 225, 0.2) 0%, rgba(65, 105, 225, 0.1) 100%);
          border-left: 4px solid var(--accent-gold);
          font-weight: 600;
        }

        .glassmorphism {
          background: rgba(255, 255, 255, 0.95);
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

        /* Mobile First - Ícones padronizados */
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
      
      <div className="min-h-screen flex w-full bg-[#F5F7FA]">
        {/* Sidebar - Azul Marinho Escuro #1A237E */}
        <Sidebar className="border-r-0 shadow-2xl hidden md:flex" style={{ backgroundColor: '#1A237E' }}>
          <SidebarHeader className="border-b border-white/10 p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#4169E1] to-[#FFD700] rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl">
                <Scale className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg lg:text-xl text-white tracking-tight">SIHDD</h2>
                <p className="text-[10px] lg:text-xs text-blue-200 font-medium">Sistema Inteligente</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2 lg:p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] lg:text-xs font-semibold text-blue-200 uppercase tracking-wider px-2 lg:px-3 py-2 mb-1 lg:mb-2">
                Módulos
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            group relative overflow-hidden
                            hover:bg-white/10
                            transition-all duration-300 rounded-lg lg:rounded-xl mb-1
                            ${isActive ? 'nav-item-active text-white' : 'text-blue-100 hover:text-white'}
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-3">
                            <div className={`
                              w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center
                              transition-all duration-300
                              ${isActive 
                                ? 'bg-gradient-to-br from-[#4169E1] to-[#FFD700] shadow-lg scale-110' 
                                : 'bg-white/5 group-hover:bg-white/10 group-hover:scale-105'
                              }
                            `}>
                              <item.icon className="w-4 h-4 lg:w-5 lg:h-5" style={{ width: '1rem', height: '1rem' }} />
                            </div>
                            <span className="flex-1 font-medium text-sm lg:text-base">{item.title}</span>
                            {isActive && (
                              <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse shadow-lg shadow-yellow-500/50" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/10 p-3 lg:p-4">
            <Link to={createPageUrl("Configuracoes")} className="block">
              <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#4169E1] to-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs lg:text-sm">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-xs lg:text-sm truncate">
                    {user?.full_name?.split(' ')[0] || 'Usuário'}
                  </p>
                  <p className="text-[10px] lg:text-xs text-blue-200 truncate">Configurações</p>
                </div>
                <Settings className="w-3 h-3 lg:w-4 lg:h-4 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative w-full min-w-0">
          {/* Top Bar */}
          <header className="glassmorphism border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <SidebarTrigger className="md:hidden hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200">
                  <Menu className="w-4 h-4 text-[#1A237E]" style={{ width: '1rem', height: '1rem' }} />
                </SidebarTrigger>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4169E1] to-[#FFD700] rounded-lg flex items-center justify-center shadow-lg">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#1A237E] leading-tight">SIHDD</h1>
                    <p className="text-[10px] sm:text-xs text-[#6B7280] hidden sm:block">Sistema Inteligente</p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="md:hidden w-10 h-10 bg-gradient-to-br from-[#4169E1] to-[#FFD700] rounded-full flex items-center justify-center shadow-lg"
                >
                  <Brain className="w-4 h-4 text-white" style={{ width: '1rem', height: '1rem' }} />
                </button>
                <Link to={createPageUrl("Configuracoes")} className="md:hidden">
                  <button className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shadow-lg">
                    <Settings className="w-4 h-4 text-[#1A237E]" style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto w-full">
            {children}
          </div>

          {/* Floating IA Button - Azul Royal com Dourado */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="floating-ai-button hidden md:flex fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#4169E1] via-[#5a7bea] to-[#FFD700] rounded-full shadow-2xl items-center justify-center hover:scale-110 transition-all duration-300 z-50 animate-float animate-pulse-glow group"
          >
            <Brain className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* Chat Widget */}
          {showChat && (
            <div className="chat-widget fixed bottom-28 right-6 w-96 h-[600px] glassmorphism rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-gradient-to-r from-[#1A237E] via-[#4169E1] to-[#FFD700] p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">RAG Tributário</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#10B981] rounded-full animate-pulse" />
                      <p className="text-[10px] sm:text-xs text-blue-100">IA Online</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
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