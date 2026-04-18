import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Scale, ShieldCheck, KeyRound, ArrowRight, Gavel, FileCheck2, Users } from "lucide-react";

export default function AcessoSistema() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings } = useAuth();

  // Se já autenticado, segue direto para o Dashboard
  useEffect(() => {
    if (!isLoadingAuth && !isLoadingPublicSettings && isAuthenticated) {
      navigate(createPageUrl("Dashboard"), { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, isLoadingPublicSettings, navigate]);

  const handleAcessar = () => {
    base44.auth.redirectToLogin(window.location.origin + createPageUrl("Dashboard"));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#0b1e3d] via-[#1e3a5f] to-[#0b1e3d] text-white">
      {/* Painel esquerdo — marca / apresentação */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative overflow-hidden">
        {/* Ornamento sutil */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-[#0b1e3d]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SIHDD</h1>
              <p className="text-xs text-slate-300">Sistema Integrado de Heranças, Doações e Divórcios</p>
            </div>
          </div>

          <h2 className="font-serif text-4xl lg:text-5xl leading-tight mb-4">
            Gestão jurídica <span className="text-[#D4AF37]">inteligente</span> para o seu escritório.
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8">
            Inventários, doações, divórcios e cálculo automatizado do ITCMD em uma única plataforma,
            alinhada à legislação estadual vigente.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Gavel className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="text-slate-200">Cálculo de ITCMD com base na legislação vigente por data do óbito</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="text-slate-200">Declaração SEFAZ, partilha, cessão e renúncia em poucos passos</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="text-slate-200">Portal do cliente, gestão de bens e prazos integrados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Painel direito — card de acesso */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-16 bg-white/5 backdrop-blur-sm">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl p-8 lg:p-10">
          <div className="flex items-center gap-2 mb-6">
            <KeyRound className="w-5 h-5 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900 uppercase tracking-wider">
              Acesso ao sistema
            </span>
          </div>

          <h3 className="font-serif text-2xl mb-2">Bem-vindo(a) de volta.</h3>
          <p className="text-slate-600 text-sm mb-8">
            Entre com sua conta autorizada para acessar o painel do escritório.
          </p>

          <Button
            onClick={handleAcessar}
            disabled={isLoadingAuth || isLoadingPublicSettings}
            className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold gap-2 text-base"
          >
            {isLoadingAuth || isLoadingPublicSettings ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verificando sessão...
              </>
            ) : (
              <>
                Entrar no SIHDD
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 mt-6 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Conexão segura — autenticação corporativa</span>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
              Ao acessar, você concorda com os termos de uso do sistema e com a política de
              privacidade do seu escritório. O acesso é restrito a usuários previamente autorizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}