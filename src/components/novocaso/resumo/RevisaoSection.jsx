import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pencil, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function RevisaoSection({ number, title, icon: Icon, children, onNavigate, missingFields = [] }) {
  const [open, setOpen] = useState(true);
  const hasMissing = missingFields.length > 0;

  return (
    <Card className={`border shadow-sm ${hasMissing ? 'border-amber-300' : 'border-slate-200'}`}>
      <CardHeader
        className={`flex flex-row items-center justify-between cursor-pointer py-4 ${hasMissing ? 'bg-amber-50' : 'bg-slate-50'} border-b`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${hasMissing ? 'bg-amber-200 text-amber-800' : 'bg-blue-900 text-white'}`}>
            {number}
          </div>
          <CardTitle className="text-base flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-slate-500" />}
            {title}
          </CardTitle>
          {hasMissing ? (
            <div className="flex items-center gap-1 text-amber-600 text-xs font-medium ml-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              {missingFields.length} campo(s) pendente(s)
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium ml-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completo
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onNavigate && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:text-blue-900 gap-1 text-xs"
              onClick={(e) => { e.stopPropagation(); onNavigate(); }}
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </Button>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </CardHeader>
      {open && (
        <CardContent className="p-5">
          {hasMissing && (
            <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-700">
              <span className="font-semibold">Campos pendentes:</span> {missingFields.join(", ")}
            </div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  );
}