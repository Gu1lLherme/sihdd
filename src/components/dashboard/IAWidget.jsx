import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function IAWidget() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (text) => {
    const q = text || query;
    if (q.trim()) {
      navigate(createPageUrl("ChatAssistente") + `?q=${encodeURIComponent(q)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="bg-[#0f172a] text-white border-none shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -ml-6 -mb-6" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-bold text-lg">IA Jurídica</h3>
        </div>
        
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Precisa de uma análise rápida? Peça à IA para revisar jurisprudências ou calcular impostos.
        </p>

        <div className="space-y-3 mb-6">
          <Button 
            variant="outline" 
            className="w-full justify-start text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white bg-transparent h-auto py-2 px-3 text-sm font-normal"
            onClick={() => handleSearch("Analisar jurisprudência ITCMD SP")}
          >
            Analisar jurisprudência ITCMD SP
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white bg-transparent h-auto py-2 px-3 text-sm font-normal"
            onClick={() => handleSearch("Calcular partilha ideal")}
          >
            Calcular partilha ideal
          </Button>
        </div>

        <div className="relative">
          <Input 
            placeholder="Digite sua dúvida..." 
            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-0 top-0 text-[#D4AF37] hover:text-[#e5c147] hover:bg-transparent"
            onClick={() => handleSearch()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}