
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import DadosFalecidoForm from "../components/novocaso/DadosFalecidoForm";
import HerdeirosForm from "../components/novocaso/HerdeirosForm";
import BensForm from "../components/novocaso/BensForm";
import CalculoITCMD from "../components/novocaso/CalculoITCMD";
import ResumoFinal from "../components/novocaso/ResumoFinal";

const steps = [
  { id: 1, title: "Dados do Falecido", icon: "📋" },
  { id: 2, title: "Herdeiros", icon: "👥" },
  { id: 3, title: "Bens do Inventário", icon: "🏠" },
  { id: 4, title: "Cálculo ITCMD", icon: "🧮" },
  { id: 5, title: "Revisão e Conclusão", icon: "✅" },
];

export default function NovoCaso() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [formData, setFormData] = useState({
    falecido_nome: "",
    falecido_cpf: "",
    data_obito: "",
    conjuge_nome: "",
    conjuge_cpf: "",
    patrimonio_total: 0,
    itcmd_total: 0, // Added based on mutationFn
    aliquota: 4,
    status: "rascunho",
    herdeiros: [],
    bens: [],
  });

  const [calculoFeito, setCalculoFeito] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const criarCasoMutation = useMutation({
    mutationFn: async (data) => {
      const caso = await base44.entities.Caso.create({
        numero_processo: `PROC-${Date.now()}`,
        falecido_nome: data.falecido_nome,
        falecido_cpf: data.falecido_cpf,
        data_obito: data.data_obito,
        conjuge_nome: data.conjuge_nome,
        conjuge_cpf: data.conjuge_cpf,
        patrimonio_total: data.patrimonio_total,
        itcmd_total: data.patrimonio_total * (data.aliquota / 100),
        aliquota: data.aliquota,
        status: "em_analise",
      });

      if (data.herdeiros.length > 0) {
        await base44.entities.Herdeiro.bulkCreate(
          data.herdeiros.map(h => ({ ...h, caso_id: caso.id }))
        );
      }

      if (data.bens.length > 0) {
        await base44.entities.Bem.bulkCreate(
          data.bens.map(b => ({ ...b, caso_id: caso.id }))
        );
      }

      // Registrar na auditoria
      await base44.entities.AuditLog.create({
        caso_id: caso.id,
        action_type: "create",
        entity_type: "Caso",
        entity_id: caso.id,
        action_description: `Novo caso criado: Inventário de ${data.falecido_nome}`,
        user_email: user?.email || "unknown",
        user_name: user?.full_name || "Unknown",
        new_data: {
          falecido: data.falecido_nome,
          patrimonio: data.patrimonio_total,
          herdeiros_count: data.herdeiros.length,
          bens_count: data.bens.length,
        }
      });

      return caso;
    },
    onSuccess: (caso) => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      navigate(createPageUrl(`DetalhesCaso?id=${caso.id}`));
    },
  });

  const handleNext = () => {
    if (etapaAtual < steps.length) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const handlePrevious = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const calcularPatrimonioTotal = () => {
    return formData.bens.reduce((sum, bem) => sum + (parseFloat(bem.valor) || 0), 0);
  };

  const calcularITCMD = () => {
    const patrimonioTotal = calcularPatrimonioTotal();
    const aliquota = formData.aliquota; // Use aliquota from formData
    const valorITCMD = (patrimonioTotal * aliquota) / 100;
    
    const herdeirosCalculados = formData.herdeiros.map(h => {
      const percentual = parseFloat(h.percentual_partilha) || 0;
      const valorParte = (patrimonioTotal * percentual) / 100;
      const valorITCMDHerdeiro = (valorParte * aliquota) / 100;
      
      return {
        ...h,
        valor_parte: valorParte,
        valor_itcmd: valorITCMDHerdeiro,
      };
    });
    
    setFormData(prev => ({
      ...prev,
      patrimonio_total: patrimonioTotal,
      itcmd_total: valorITCMD,
      herdeiros: herdeirosCalculados,
    }));
    setCalculoFeito(true);
  };

  const handleSalvar = () => {
    criarCasoMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a5f]">Novo Caso de Inventário</h1>
            <p className="text-slate-600">Preencha as informações passo a passo</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    etapaAtual >= step.id 
                      ? 'bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white shadow-lg scale-110' 
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}>
                    {step.icon}
                  </div>
                  <p className={`text-xs mt-2 font-medium text-center ${
                    etapaAtual >= step.id ? 'text-[#1e3a5f]' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                    etapaAtual > step.id ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f]' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white border-none shadow-xl">
          <CardContent className="p-6 md:p-8">
            {etapaAtual === 1 && (
              <DadosFalecidoForm formData={formData} setFormData={setFormData} />
            )}
            
            {etapaAtual === 2 && (
              <HerdeirosForm herdeiros={formData.herdeiros} setHerdeiros={(newHerdeiros) => setFormData(prev => ({ ...prev, herdeiros: newHerdeiros }))} />
            )}
            
            {etapaAtual === 3 && (
              <BensForm bens={formData.bens} setBens={(newBens) => setFormData(prev => ({ ...prev, bens: newBens }))} />
            )}
            
            {etapaAtual === 4 && (
              <CalculoITCMD 
                bens={formData.bens} 
                herdeiros={formData.herdeiros}
                calculoFeito={calculoFeito}
                onCalcular={calcularITCMD}
              />
            )}
            
            {etapaAtual === 5 && (
              <ResumoFinal 
                formData={formData}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={etapaAtual === 1}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {etapaAtual < steps.length ? (
            <Button
              onClick={etapaAtual === 4 && !calculoFeito ? calcularITCMD : handleNext}
              className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] hover:from-[#2d5a8f] hover:to-[#1e3a5f]"
            >
              {etapaAtual === 4 && !calculoFeito ? (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular ITCMD
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSalvar}
              disabled={criarCasoMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {criarCasoMutation.isPending ? 'Salvando...' : 'Finalizar e Salvar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
