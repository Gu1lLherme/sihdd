import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }) {
  const location = useLocation();
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const navItems = [
    { label: "Dashboard", path: "Dashboard" },
    { label: "Fato Jurídico", path: "FatoJuridico", hasDropdown: true },
    { label: "Gestão & Prazos", path: "GestaoPrazos" },
    { label: "Inteligência & Ferramentas", path: "InteligenciaFerramentas" },
    { label: "Relatórios", path: "Relatorios" },
  ];

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Top Navbar */}
      <nav className="bg-[#0f172a] text-white h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
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

          <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-slate-800 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]" />
          </Button>

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
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
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