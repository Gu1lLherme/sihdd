import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scale, FileText, Receipt, BarChart3, History, Link2, MessageCircle, Briefcase, FolderOpen, LogOut } from "lucide-react";
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

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Briefcase,
  },
  {
    title: "Inventários",
    url: createPageUrl("Inventarios"),
    icon: FolderOpen,
  },
  {
    title: "Integrações",
    url: createPageUrl("Integracoes"),
    icon: Link2,
  },
  {
    title: "Auditoria",
    url: createPageUrl("Auditoria"),
    icon: History,
  },
  {
    title: "Relatórios",
    url: createPageUrl("Relatorios"),
    icon: BarChart3,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [showChat, setShowChat] = React.useState(false);

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 217 91% 33%;
          --primary-foreground: 210 100% 98%;
          --accent: 217 91% 60%;
          --muted: 210 20% 96%;
          --success: 142 76% 36%;
          --warning: 38 92% 50%;
          --destructive: 0 84% 60%;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.4); }
          50% { box-shadow: 0 0 30px rgba(37, 99, 235, 0.6); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .nav-item-active {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(96, 165, 250, 0.15) 100%);
          border-left: 3px solid #2563EB;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar className="border-r border-slate-200/80 bg-white/95 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/80 p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 rounded-xl flex items-center justify-center shadow-xl">
                <Scale className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">SIHDD</h2>
                <p className="text-xs text-slate-500 font-medium">Sistema de Inventário</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Navegação Principal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            group relative overflow-hidden
                            hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
                            transition-all duration-300 rounded-xl mb-1
                            ${isActive ? 'nav-item-active font-semibold text-blue-900' : 'text-slate-700 hover:text-blue-900'}
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                            <div className={`
                              w-8 h-8 rounded-lg flex items-center justify-center
                              transition-all duration-300
                              ${isActive 
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg scale-110' 
                                : 'bg-slate-100 group-hover:bg-blue-100 group-hover:scale-105'
                              }
                            `}>
                              <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'}`} />
                            </div>
                            <span className="flex-1">{item.title}</span>
                            {isActive && (
                              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Assistência IA
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="w-full group flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-purple-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 rounded-xl relative overflow-hidden"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Assistente Virtual</span>
                  <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </button>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/80 p-4">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">Advogado</p>
                <p className="text-xs text-slate-500 truncate">Gestão de Inventários</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col relative">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">SIHDD</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {/* Floating Chat Button with Animation */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 animate-float animate-pulse-glow group"
          >
            <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* Enhanced Chat Widget */}
          {showChat && (
            <div className="fixed bottom-28 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Assistente SIHDD</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-xs text-blue-100">Online • Especialista em Inventários</p>
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
                title="Assistente Virtual"
              />
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}