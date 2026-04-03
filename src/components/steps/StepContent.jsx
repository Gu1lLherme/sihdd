import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Card wrapper para o conteúdo da etapa atual.
 * 
 * Props:
 * - titulo: string
 * - colorClass?: string (ex: "text-blue-900")
 * - children: React.ReactNode
 * - id?: string
 */
export default function StepContent({ titulo, colorClass = "text-blue-900", children, id }) {
  return (
    <Card id={id} className="border-slate-200 shadow-lg">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className={`text-xl ${colorClass}`}>
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}