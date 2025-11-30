import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Gift, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { masks } from "@/components/Masks";

export default function Doacoes() {
  const { data: doacoes, isLoading } = useQuery({
    queryKey: ['doacoes'],
    queryFn: () => base44.entities.Doacao.list("-created_date"),
    initialData: [],
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-[#333333] mb-2">Doações</h1>
             <p className="text-[#AAAAAA]">Gestão de doações e cálculo de ITCMD</p>
          </div>
          <Link to={createPageUrl("NovaDoacao")}>
            <Button className="bg-[#4169E1] hover:bg-[#3151c7] text-white font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Nova Doação
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {doacoes.map((doacao) => (
            <Card key={doacao.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{doacao.doador_nome} → {doacao.donatario_nome}</h3>
                    <p className="text-sm text-gray-500">Data: {doacao.data_doacao}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="font-bold text-lg text-blue-600">
                     {masks.currency(doacao.valor_tributo ? doacao.valor_tributo * 100 : 0)}
                   </p>
                   <Badge variant={doacao.status === 'concluido' ? 'success' : 'secondary'}>
                     {doacao.status}
                   </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {doacoes.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-gray-500">Nenhuma doação registrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}