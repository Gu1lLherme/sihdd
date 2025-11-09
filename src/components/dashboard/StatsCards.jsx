import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({ title, value, icon: Icon, gradient, iconBg, iconColor }) {
  return (
    <Card className="glassmorphism border border-slate-200 card-shadow-hover overflow-hidden relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#6B7280] mb-2 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-bold text-[#111827] group-hover:scale-105 transition-transform duration-300">
              {value}
            </p>
          </div>
          <div className={`${iconBg} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
            <Icon className={`w-7 h-7 ${iconColor}`} />
          </div>
        </div>
        <div className={`h-1.5 w-0 group-hover:w-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`} />
      </CardContent>
    </Card>
  );
}