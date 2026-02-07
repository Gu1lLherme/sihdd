import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export default function StatsCardNew({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection = 'up',
  subtext,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
  urgent = false
}) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-3 rounded-xl", iconBg)}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
          {urgent && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>

        <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-[#1a237e]">{value}</span>
          {urgent && <span className="text-red-500 font-bold text-sm">Urgentes</span>}
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className={cn(
              "px-1.5 py-0.5 rounded flex items-center gap-1",
              trendDirection === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {trendDirection === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
            <span className="text-slate-400">{subtext}</span>
          </div>
        )}

        {!trend && subtext && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
             {subtext}
          </p>
        )}
        
        {/* Avatars placeholder for "Processos Ativos" if needed, can be passed as children later */}
      </CardContent>
    </Card>
  );
}