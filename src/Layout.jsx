import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Scale, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Menu,
  LogOut,
  Settings,
  Info,
  CheckCircle2,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children }) {
  const location = { pathname: window.location.pathname };
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const { data: settings } = useQuery({
    queryKey: ['user-settings-layout', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const all = await base44.entities.UserSettings.list();
      return all.find(s => s.user_email === user.email) || null;
    },
    enabled: !!user?.email
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => base44.entities.AuditLog.list("-created_date", 20),
    initialData: [],
  });

  const navItems = [
    { label: "Dashboard", path: "Dashboard" },
    { label: "Fato Jurídico", path: "FatoJuridico", hasDropdown: true },
    { label: "Gestão & Prazos", path: "GestaoPrazos" },
    { label: "Inteligência & Ferramentas", path: "InteligenciaFerramentas" },
    { label: "Relatórios", path: "Relatorios" },
    { label: "Legislação", path: "LegislacaoAdmin" },
  ];

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
        case 'create': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        case 'update': return <Info className="w-4 h-4 text-blue-500" />;
        case 'delete': return <Info className="w-4 h-4 text-red-500" />;
        default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Roboto:wght@300;400;500;700&family=Lato:wght@300;400;700&display=swap');
        
        :root {
          --font-sans: ${
            settings?.font_family === 'roboto' ? "'Roboto', sans-serif" : 
            settings?.font_family === 'lato' ? "'Lato', sans-serif" : 
            settings?.font_family === 'merriweather' ? "'Merriweather', serif" :
            settings?.font_family === 'system' ? "system-ui, -apple-system, sans-serif" :
            "'Inter', system-ui, -apple-system, sans-serif"
          };
          --font-serif: 'Merriweather', Georgia, serif;
          
          /* Dynamic Theme Colors */
          --theme-primary: ${
            settings?.color_scheme === 'gold' ? '#D4AF37' :
            settings?.color_scheme === 'green' ? '#10B981' :
            settings?.color_scheme === 'purple' ? '#8B5CF6' :
            settings?.color_scheme === 'slate' ? '#475569' :
            '#1a237e' /* Default Blue */
          };
          
          --theme-accent: ${
             settings?.color_scheme === 'gold' ? '#1a237e' :
             settings?.color_scheme === 'green' ? '#064E3B' :
             settings?.color_scheme === 'purple' ? '#4C1D95' :
             settings?.color_scheme === 'slate' ? '#0F172A' :
             '#D4AF37' /* Default Gold Accent */
          };
        }

        body {
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        h1, h2, h3, h4, h5, h6, .font-serif {
          font-family: var(--font-serif);
        }
        
        .font-sans {
          font-family: var(--font-sans);
        }
        
        /* Apply dynamic colors to navbar if needed via utility classes or specific overrides */
        .bg-theme-primary {
           background-color: var(--theme-primary) !important;
        }
        .text-theme-primary {
           color: var(--theme-primary) !important;
        }
        .bg-theme-accent {
           background-color: var(--theme-accent) !important;
        }
        .text-theme-accent {
           color: var(--theme-accent) !important;
        }
      `}</style>
      {/* Top Navbar */}
      <nav className="bg-theme-primary text-white h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-md transition-colors duration-500">
        {/* Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2 group">
            <div className="bg-[#D4AF37] p-1.5 rounded-lg group-hover:bg-[#e5c147] transition-colors">
              <Scale className="w-5 h-5 text-[#0f172a]" />
            </div>
            <span className="text-xl font-serif font-bold tracking-wide">SIHDD</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link 
                  to={createPageUrl(item.path)}
                  className={`
                    flex items-center gap-1 hover:text-[#D4AF37] transition-colors py-2
                    ${location.pathname.includes(item.path) ? 'text-[#D4AF37]' : 'text-slate-300'}
                  `}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </Link>
                {location.pathname.includes(item.path) && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar processo..." 
              className="bg-slate-800/50 border-slate-700 text-slate-200 pl-9 h-9 rounded-full focus:bg-slate-800 focus:border-[#D4AF37] transition-all placeholder:text-slate-500"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-slate-800 rounded-full">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-semibold text-slate-900 leading-none">Notificações</h4>
                <p className="text-xs text-slate-500 mt-1">Últimas atualizações do sistema</p>
              </div>
              <ScrollArea className="h-[300px]">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        Nenhuma notificação recente
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex gap-3">
                                    <div className="mt-1 shrink-0">
                                        {getNotificationIcon(notif.action_type)}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-900 line-clamp-2">
                                            {notif.action_description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{new Date(notif.created_date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <Badge variant="secondary" className="text-[10px] px-1 h-5">
                                                {notif.entity_type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </ScrollArea>
              <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                <Link to={createPageUrl("Configuracoes")} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Ver todas em Configurações
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 p-0 border border-slate-600 hover:border-[#D4AF37] transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=D4AF37&color=fff`} />
                  <AvatarFallback className="bg-[#D4AF37] text-white">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name || 'Usuário'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to={createPageUrl("Configuracoes")}>
                <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Trigger */}
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-300">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
}