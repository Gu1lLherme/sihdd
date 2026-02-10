import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, Gift, HeartCrack } from "lucide-react";

import Inventarios from "./Inventarios";
import Doacoes from "./Doacoes";
import Divorcios from "./Divorcios";

export default function FatoJuridico() {
  const [activeTab, setActiveTab] = useState("inventarios");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Unificado (Opcional, mas ajuda na identidade da tela "Única") */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 mb-0">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Fato Jurídico</h1>
        <p className="text-slate-500 text-sm">Central de gestão de Inventários, Doações e Divórcios</p>
      </div>

      <div className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-1 border border-slate-200 shadow-sm rounded-lg w-full md:w-auto grid grid-cols-3 md:inline-flex h-auto">
            <TabsTrigger 
                value="inventarios" 
                className="py-2.5 px-6 data-[state=active]:bg-[#1a237e] data-[state=active]:text-[#D4AF37] data-[state=active]:border-[#D4AF37] border border-transparent rounded-md transition-all duration-200 flex items-center justify-center gap-2"
            >
                <FolderOpen className="w-4 h-4" />
                <span className="font-semibold">Inventários</span>
            </TabsTrigger>
            <TabsTrigger 
                value="doacoes" 
                className="py-2.5 px-6 data-[state=active]:bg-[#1a237e] data-[state=active]:text-[#D4AF37] data-[state=active]:border-[#D4AF37] border border-transparent rounded-md transition-all duration-200 flex items-center justify-center gap-2"
            >
                <Gift className="w-4 h-4" />
                <span className="font-semibold">Doações</span>
            </TabsTrigger>
            <TabsTrigger 
                value="divorcios" 
                className="py-2.5 px-6 data-[state=active]:bg-[#1a237e] data-[state=active]:text-[#D4AF37] data-[state=active]:border-[#D4AF37] border border-transparent rounded-md transition-all duration-200 flex items-center justify-center gap-2"
            >
                <HeartCrack className="w-4 h-4" />
                <span className="font-semibold">Divórcios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventarios" className="mt-0">
            {/* Renderiza a página de Inventários dentro da aba */}
            <div className="-mt-8 -mx-4 md:-mx-8">
                 {/* Ajuste de margem negativa para compensar o padding da página original se necessário, 
                    ou apenas renderizar. Como as páginas originais tem padding, vai somar.
                    Vou renderizar direto. 
                 */}
                 <Inventarios />
            </div>
          </TabsContent>

          <TabsContent value="doacoes" className="mt-0">
             <div className="-mt-8 -mx-4 md:-mx-8">
                <Doacoes />
             </div>
          </TabsContent>

          <TabsContent value="divorcios" className="mt-0">
             <div className="-mt-8 -mx-4 md:-mx-8">
                <Divorcios />
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}