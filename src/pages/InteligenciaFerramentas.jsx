import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Scale, Users } from "lucide-react";
import ChatAssistente from "./ChatAssistente";
import ModelagemPartilha from "./ModelagemPartilha";
import ArvoreGenealogica from "./ArvoreGenealogica";

export default function InteligenciaFerramentas() {
  const allowed = ["chat", "modelagem", "arvore"];
  const getInitial = () => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    return allowed.includes(t) ? t : "chat";
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
          <h1 className="text-3xl font-bold text-blue-900">Inteligência & Ferramentas</h1>
          <p className="text-slate-600">Utilize IA, modelagem e árvore genealógica para agilizar seus processos</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chat" className="gap-2">
              <Brain className="w-4 h-4" />
              IA Jurídica RAG
            </TabsTrigger>
            <TabsTrigger value="modelagem" className="gap-2">
              <Scale className="w-4 h-4" />
              Modelagem
            </TabsTrigger>
            <TabsTrigger value="arvore" className="gap-2">
              <Users className="w-4 h-4" />
              Árvore Genealógica
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatAssistente />
          </TabsContent>
          <TabsContent value="modelagem">
            <ModelagemPartilha />
          </TabsContent>
          <TabsContent value="arvore">
            <ArvoreGenealogica />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}