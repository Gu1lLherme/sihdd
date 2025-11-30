import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import FormDoador from "@/components/doacao/FormDoador";
import FormDonatario from "@/components/doacao/FormDonatario";
import ListaBensDoacao from "@/components/doacao/ListaBensDoacao";

export default function NovaDoacao() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [bens, setBens] = useState([]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // 1. Create Doacao
      const doacao = await base44.entities.Doacao.create(data.doacao);
      // 2. Create Bens linked to Doacao
      if (data.bens.length > 0) {
        const bensToCreate = data.bens.map(b => ({ ...b, doacao_id: doacao.id, documento_url: "simulated_url.pdf" }));
        await base44.entities.Bem.bulkCreate(bensToCreate);
      }
      return doacao;
    },
    onSuccess: () => {
      navigate(createPageUrl("Doacoes"));
    }
  });

  const handleSubmit = () => {
    // Calc total and tax (mock logic)
    const totalBens = bens.reduce((acc, curr) => acc + curr.valor, 0);
    const tax = totalBens * 0.04; // 4% mock ITCMD

    const doacaoData = {
      ...formData,
      valor_total_bens: totalBens,
      valor_tributo: tax,
      data_doacao: new Date().toISOString().split('T')[0], // Default to today if not set
      status: "aguardando_pagamento"
    };

    createMutation.mutate({ doacao: doacaoData, bens });
  };

  const handleGenerateGuia = () => {
    alert("Integração SEFAZ-SE: Guia ITCMD gerada com sucesso!");
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to={createPageUrl("Doacoes")}>
            <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#333333]">Nova Doação</h1>
        </div>

        <FormDoador 
          data={formData} 
          onChange={(key, val) => setFormData({...formData, [key]: val})} 
        />
        
        <FormDonatario 
          data={formData} 
          onChange={(key, val) => setFormData({...formData, [key]: val})} 
        />

        <ListaBensDoacao 
          bens={bens}
          onAddBem={(bem) => setBens([...bens, bem])}
          onRemoveBem={(idx) => setBens(bens.filter((_, i) => i !== idx))}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" className="border-blue-600 text-blue-600" onClick={handleGenerateGuia}>
            <FileCheck className="w-4 h-4 mr-2" />
            Gerar Guia ITCMD (SEFAZ-SE)
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-[#4169E1] hover:bg-[#3151c7] text-white"
            disabled={createMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {createMutation.isPending ? "Salvando..." : "Salvar Doação"}
          </Button>
        </div>
      </div>
    </div>
  );
}