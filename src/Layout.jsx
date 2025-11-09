import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scale, FileText, Receipt, BarChart3, History, Link2, MessageCircle, Briefcase } from "lucide-react";
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
    title: "Casos",
    url: createPageUrl("Dashboard"),
    icon: Briefcase,
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
          --primary: 210 100% 20%;
          --primary-foreground: 48 100% 96%;
          --accent: 45 93% 47%;
          --muted: 210 20% 95%;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-blue-900">SIHDD</h2>
                <p className="text-xs text-slate-500">Sistema de Inventário</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Assistência
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Assistente Virtual</span>
                </button>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
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
              <h1 className="text-xl font-bold text-blue-900">SIHDD</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {/* Floating Chat Button for Mobile/Desktop */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 z-50"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>

          {/* Chat Widget */}
          {showChat && (
            <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Assistente SIHDD</h3>
                    <p className="text-xs text-blue-100">Especialista em Inventários</p>
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