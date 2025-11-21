import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function EstatisticasCertidoes({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-2 border-green-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#AAAAAA] uppercase">Válidas</p>
              <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-amber-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#AAAAAA] uppercase">Vencendo em 5 dias</p>
              <p className="text-2xl font-bold text-amber-600">{stats.expiring}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-red-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#AAAAAA] uppercase">Vencidas/Com Débito</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}