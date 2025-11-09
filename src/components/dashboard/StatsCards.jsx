import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({ title, value, icon: Icon, gradient, iconBg, iconColor }) {
  return (
    <Card className="border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-slate-900 group-hover:scale-105 transition-transform duration-300">
              {value}
            </p>
          </div>
          <div className={`${iconBg} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`} />
      </CardContent>
    </Card>
  );
}