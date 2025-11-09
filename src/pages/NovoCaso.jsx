import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import DadosBasicos from "../components/novocaso/DadosBasicos";
import Herdeiros from "../components/novocaso/Herdeiros";
import Bens from "../components/novocaso/Bens";
import Resumo from "../components/novocaso/Resumo";

const ETAPAS = [
  { id: 1, titulo: "Dados Básicos", componente: DadosBasicos },
  { id: 2, titulo: "Herdeiros", componente: Herdeiros },
  { id: 3, titulo: "Bens", componente: Bens },
  { id: 4, titulo: "Resumo", componente: Resumo },
];

export default function NovoCaso() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [formData, setFormData] = useState({
    nome_falecido: "",
    cpf_falecido: "",
    data_obito: "",
    conjuge_nome: "",
    conjuge_cpf: "",
    valor_patrimonio: 0,
    aliquota: 4,
    status: "coleta_dados",
    herdeiros: [],
    bens: [],
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const criarCasoMutation = useMutation({
    mutationFn: async (data) => {
      const caso = await base44.entities.Caso.create({
        numero_caso: `PROC-${Date.now()}`,
        nome_falecido: data.nome_falecido,
        cpf_falecido: data.cpf_falecido,
        data_obito: data.data_obito,
        conjuge_nome: data.conjuge_nome,
        conjuge_cpf: data.conjuge_cpf,
        valor_patrimonio: data.valor_patrimonio,
        valor_itcmd: data.valor_patrimonio * (data.aliquota / 100),
        aliquota: data.aliquota,
        status: "geracao_dae",
        prazo_dias: 30,
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
        action_description: `Novo caso criado: Inventário de ${data.nome_falecido}`,
        user_email: user?.email || "unknown",
        user_name: user?.full_name || "Unknown",
        new_data: {
          falecido: data.nome_falecido,
          patrimonio: data.valor_patrimonio,
          herdeiros_count: data.herdeiros.length,
          bens_count: data.bens.length,
        }
      });

      return caso;
    },
    onSuccess: (caso) => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
      navigate(createPageUrl(`DetalheCaso?id=${caso.id}`));
    },
  });

  const avancar = () => {
    if (etapaAtual < ETAPAS.length) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const voltar = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const salvar = () => {
    criarCasoMutation.mutate(formData);
  };

  const EtapaComponente = ETAPAS[etapaAtual - 1].componente;

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Novo Caso de Inventário</h1>
            <p className="text-slate-600 mt-1">Preencha as informações do processo</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {ETAPAS.map((etapa, index) => (
              <div key={etapa.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      etapaAtual >= etapa.id
                        ? "bg-blue-900 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {etapa.id}
                  </div>
                  <p
                    className={`text-sm mt-2 font-medium ${
                      etapaAtual >= etapa.id ? "text-blue-900" : "text-slate-500"
                    }`}
                  >
                    {etapa.titulo}
                  </p>
                </div>
                {index < ETAPAS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-colors ${
                      etapaAtual > etapa.id ? "bg-blue-900" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-xl text-blue-900">
              {ETAPAS[etapaAtual - 1].titulo}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <EtapaComponente formData={formData} setFormData={setFormData} />
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={voltar}
            disabled={etapaAtual === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {etapaAtual < ETAPAS.length ? (
            <Button
              onClick={avancar}
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={salvar}
              disabled={criarCasoMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {criarCasoMutation.isPending ? "Salvando..." : "Salvar Caso"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}