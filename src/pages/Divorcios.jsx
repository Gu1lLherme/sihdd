import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, HeartCrack, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { masks } from "@/components/Masks";

export default function Divorcios() {
  const { data: divorcios, isLoading } = useQuery({
    queryKey: ['divorcios'],
    queryFn: () => base44.entities.Divorcio.list("-created_date"),
    initialData: [],
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-[#333333] mb-2">Divórcios</h1>
             <p className="text-[#AAAAAA]">Cálculo de excesso de meação e ITCMD</p>
          </div>
          <Link to={createPageUrl("NovoDivorcio")}>
            <Button className="bg-[#4169E1] hover:bg-[#3151c7] text-white font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Novo Divórcio
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {divorcios.map((divorcio) => (
            <Card key={divorcio.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <HeartCrack className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{divorcio.conjuge_doador_nome} & {divorcio.conjuge_donatario_nome}</h3>
                    <p className="text-sm text-gray-500">Regime: {divorcio.regime_bens}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-500">Tributo</p>
                   <p className="font-bold text-lg text-purple-600">
                     {masks.currency(divorcio.valor_tributo ? divorcio.valor_tributo * 100 : 0)}
                   </p>
                   <Badge variant={divorcio.status === 'concluido' ? 'success' : 'secondary'}>
                     {divorcio.status}
                   </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {divorcios.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-gray-500">Nenhum divórcio registrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}