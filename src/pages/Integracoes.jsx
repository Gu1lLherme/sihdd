import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link2, Building2, Car, Home, FileCheck, AlertCircle, CheckCircle2, Clock, Search, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import ConsultaSEFAZ from "../components/integracoes/ConsultaSEFAZ";
import ConsultaCartorio from "../components/integracoes/ConsultaCartorio";
import ConsultaDetran from "../components/integracoes/ConsultaDetran";
import HistoricoIntegracoes from "../components/integracoes/HistoricoIntegracoes";

export default function Integracoes() {
  const [activeTab, setActiveTab] = useState("sefaz");

  const { data: consultas } = useQuery({
    queryKey: ['integracoes-consultas'],
    queryFn: () => base44.entities.IntegracaoConsulta.list("-created_date", 50),
    initialData: [],
  });

  const stats = {
    total: consultas.length,
    sucesso: consultas.filter(c => c.status === 'sucesso').length,
    erro: consultas.filter(c => c.status === 'erro').length,
    pendente: consultas.filter(c => c.status === 'pendente' || c.status === 'processando').length,
  };

  const tabs = [
    { id: "sefaz", label: "SEFAZ/SE", icon: Building2, component: ConsultaSEFAZ },
    { id: "cartorio", label: "Cartório", icon: Home, component: ConsultaCartorio },
    { id: "detran", label: "DETRAN", icon: Car, component: ConsultaDetran },
    { id: "historico", label: "Histórico", icon: FileCheck, component: HistoricoIntegracoes },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    const ids = tabs.map(tab => tab.id);
    if (t && ids.includes(t)) setActiveTab(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab]);

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Integrações Oficiais</h1>
              <p className="text-slate-600">Consultas automatizadas com órgãos públicos</p>
            </div>
          </div>
        </div>

        {/* Alert Info */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Importante:</strong> Estas integrações simulam consultas reais aos órgãos oficiais.
            Em produção, seriam conectadas às APIs oficiais da SEFAZ/SE, cartórios e DETRAN.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total de Consultas</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Search className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Sucesso</p>
                  <p className="text-2xl font-bold text-green-600">{stats.sucesso}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Erro</p>
                  <p className="text-2xl font-bold text-red-600">{stats.erro}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pendente</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pendente}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        {ActiveComponent && <ActiveComponent consultas={consultas} />}
      </div>
    </div>
  );
}