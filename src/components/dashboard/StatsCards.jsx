import React from 'react';
import { Card } from "@/components/ui/card";

export default function StatsCards({ title, value, icon: Icon, gradient, iconBg, iconColor }) {
  return (
    <Card className="relative overflow-hidden bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full transform translate-x-12 -translate-y-12`} />
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-[#1e3a5f]">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${iconBg} shadow-md`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    </Card>
  );
}