import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Calendar as CalendarIcon, Shield } from "lucide-react";
import Tasks from "./Tasks";
import CalendarPage from "./Calendar";
import PortalCliente from "./PortalCliente";

export default function GestaoPrazos() {
  const allowed = ["tasks", "calendar", "portal"];
  const getInitial = () => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    return allowed.includes(t) ? t : "tasks";
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
          <h1 className="text-3xl font-bold text-blue-900">Gestão & Prazos</h1>
          <p className="text-slate-600">Gerencie tarefas, calendário e o portal do cliente em um só lugar</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="tasks" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="portal" className="gap-2">
              <Shield className="w-4 h-4" />
              Portal do Cliente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <Tasks />
          </TabsContent>
          <TabsContent value="calendar">
            <CalendarPage />
          </TabsContent>
          <TabsContent value="portal">
            <PortalCliente />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}