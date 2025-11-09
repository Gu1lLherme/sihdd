import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards({ title, value, icon: Icon, gradient, iconBg, iconColor, isGold = false }) {
  return (
    <Card className={`
      glassmorphism overflow-hidden relative group card-shadow-hover
      ${isGold 
        ? 'border-2 border-[#FFD700]/30 bg-gradient-to-br from-amber-50/50 to-yellow-50/50' 
        : 'border-2 border-[#4169E1]/20'
      }
    `}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <CardContent className="p-3 sm:p-4 lg:p-6 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-2 sm:gap-0 mb-2 sm:mb-4">
          <div className="flex-1 w-full sm:w-auto">
            <p className={`
              text-[10px] sm:text-xs lg:text-sm font-bold mb-1 sm:mb-2 uppercase tracking-wider line-clamp-1
              ${isGold ? 'text-[#FFC107]' : 'text-[#6B7280]'}
            `}>
              {title}
            </p>
            <p className={`
              text-xl sm:text-2xl lg:text-3xl font-extrabold group-hover:scale-105 transition-transform duration-300 break-words
              ${isGold ? 'text-[#FFD700]' : 'text-[#1A237E]'}
            `}>
              {value}
            </p>
          </div>
          <div className={`
            stat-icon ${iconBg} w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl 
            flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 
            transition-all duration-300 shadow-lg flex-shrink-0
            ${isGold ? 'ring-2 ring-[#FFD700]/30' : ''}
          `}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${iconColor}`} />
          </div>
        </div>
        <div className={`
          h-1 sm:h-1.5 w-0 group-hover:w-full bg-gradient-to-r ${gradient} 
          rounded-full transition-all duration-500
          ${isGold ? 'shadow-lg shadow-yellow-500/30' : ''}
        `} />
        {isGold && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
            <span className="text-[8px] font-bold text-[#FFD700] uppercase tracking-wider">Premium</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}