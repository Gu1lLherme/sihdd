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
  const urlParams = new URLSearchParams(window.location.search);
  const divorcioId = urlParams.get("id");
  const isEditing = !!divorcioId;

  const [formData, setFormData] = useState({});

  // Fetch for Edit
  useQuery({
    queryKey: ['divorcio', divorcioId],
    queryFn: async () => {
        if (!divorcioId) return null;
        const div = (await base44.entities.Divorcio.list()).find(d => d.id === divorcioId);
        setFormData(div);
        return div;
    },
    enabled: !!divorcioId,
    retry: false
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const cleanData = {
        ...data,
        valor_excesso_meacao: masks.currencyToNumber(data.valor_excesso_meacao),
        // Keep status if editing, else default
        status: data.status || "aguardando_pagamento"
      };

      if (isEditing) {
        return await base44.entities.Divorcio.update(divorcioId, cleanData);
      } else {
        return await base44.entities.Divorcio.create(cleanData);
      }
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
          <h1 className="text-2xl font-bold text-[#333333]">{isEditing ? "Editar Divórcio" : "Novo Divórcio"}</h1>
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
            onClick={() => mutation.mutate(formData)} 
            className="bg-[#4169E1] hover:bg-[#3151c7] text-white"
            disabled={mutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {mutation.isPending ? "Salvando..." : (isEditing ? "Atualizar Divórcio" : "Salvar Divórcio")}
          </Button>
        </div>
      </div>
    </div>
  );
}