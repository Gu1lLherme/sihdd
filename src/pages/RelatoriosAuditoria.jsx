import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, History } from "lucide-react";
import Relatorios from "./Relatorios";
import Auditoria from "./Auditoria";

export default function RelatoriosAuditoria() {
  const allowed = ["relatorios", "auditoria"];
  const getInitial = () => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    return allowed.includes(t) ? t : "relatorios";
  };
  const [tab, setTab] = useState(getInitial());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [tab]);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Relatórios & Auditoria</h1>
          <p className="text-slate-600">Acompanhe métricas e o histórico de ações do sistema</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="relatorios" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="gap-2">
              <History className="w-4 h-4" />
              Auditoria
            </TabsTrigger>
          </TabsList>

          <TabsContent value="relatorios">
            <Relatorios />
          </TabsContent>
          <TabsContent value="auditoria">
            <Auditoria />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}