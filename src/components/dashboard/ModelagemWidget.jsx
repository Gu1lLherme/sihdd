import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, DollarSign, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ModelagemWidget() {
  return (
    <Card className="bg-white border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-[#1a237e]">Modelagem Patrimonial</h3>
            <p className="text-xs text-slate-500">Simule cenários de sucessão.</p>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to={createPageUrl("ModelagemPartilha")}>
            <div className="bg-slate-50 p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer h-full">
              <Building2 className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs font-medium text-slate-700">Holdings</span>
            </div>
          </Link>
          <Link to={createPageUrl("ModelagemPartilha")}>
            <div className="bg-slate-50 p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer h-full">
              <DollarSign className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs font-medium text-slate-700">Fundos</span>
            </div>
          </Link>
        </div>

        <Link to={createPageUrl("ModelagemPartilha")}>
          <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
            Nova Simulação
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}