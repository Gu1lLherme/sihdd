import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import FormConjuges from "@/components/divorcio/FormConjuges";
import DadosFinanceiros from "@/components/divorcio/DadosFinanceiros";
import { masks } from "@/components/Masks";

export default function NovoDivorcio() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const cleanData = {
        ...data,
        valor_excesso_meacao: masks.currencyToNumber(data.valor_excesso_meacao),
        status: "aguardando_pagamento"
      };
      return await base44.entities.Divorcio.create(cleanData);
    },
    onSuccess: () => {
      navigate(createPageUrl("Divorcios"));
    }
  });

  const handleGenerateGuia = () => {
    alert("Integração SEFAZ-SE: Guia de Excesso de Meação gerada!");
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to={createPageUrl("Divorcios")}>
            <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#333333]">Novo Divórcio (Excesso de Meação)</h1>
        </div>

        <FormConjuges
          data={formData} 
          onChange={(key, val) => setFormData({...formData, [key]: val})} 
        />
        
        <DadosFinanceiros 
          data={formData} 
          onChange={(key, val) => setFormData({...formData, [key]: val})} 
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" className="border-purple-600 text-purple-600" onClick={handleGenerateGuia}>
            <FileCheck className="w-4 h-4 mr-2" />
            Gerar Guia ITCMD (SEFAZ-SE)
          </Button>
          <Button 
            onClick={() => createMutation.mutate(formData)} 
            className="bg-[#4169E1] hover:bg-[#3151c7] text-white"
            disabled={createMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {createMutation.isPending ? "Salvando..." : "Salvar Divórcio"}
          </Button>
        </div>
      </div>
    </div>
  );
}