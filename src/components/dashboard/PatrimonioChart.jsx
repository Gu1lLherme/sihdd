import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

const PERIOD_OPTIONS = [
  { key: "1d", label: "Dia" },
  { key: "1w", label: "Semana" },
  { key: "1m", label: "1 Mês" },
  { key: "6m", label: "6 Meses" },
  { key: "1y", label: "1 Ano" },
];

function formatCurrency(value) {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}K`;
  return `R$ ${value}`;
}

export default function PatrimonioChart({ casos }) {
  const [period, setPeriod] = useState("6m");

  const chartData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (period === "1d") {
      // Group by hour for the last 24h
      const hours = Array.from({ length: 24 }, (_, i) => {
        const d = new Date(today);
        d.setHours(i);
        return d;
      });
      return hours.map(date => {
        const hour = date.getHours();
        const casesInHour = casos.filter(c => {
          const cd = new Date(c.created_date);
          return cd.getFullYear() === date.getFullYear() &&
                 cd.getMonth() === date.getMonth() &&
                 cd.getDate() === date.getDate() &&
                 cd.getHours() === hour;
        });
        return {
          name: `${String(hour).padStart(2, '0')}h`,
          value: casesInHour.reduce((s, c) => s + (c.valor_patrimonio || 0), 0),
          active: hour === now.getHours(),
        };
      });
    }

    if (period === "1w") {
      // Last 7 days
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - 6 + i);
        return d;
      });
      return days.map(date => {
        const casesInDay = casos.filter(c => {
          const cd = new Date(c.created_date);
          return cd.getFullYear() === date.getFullYear() &&
                 cd.getMonth() === date.getMonth() &&
                 cd.getDate() === date.getDate();
        });
        const label = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
        return {
          name: label.charAt(0).toUpperCase() + label.slice(1),
          value: casesInDay.reduce((s, c) => s + (c.valor_patrimonio || 0), 0),
          active: date.getDate() === today.getDate(),
        };
      });
    }

    if (period === "1m") {
      // Last 30 days, grouped by ~5-day intervals (6 bars)
      const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - 29 + i);
        return d;
      });
      // Group into 6 buckets of 5 days
      const buckets = [];
      for (let i = 0; i < 30; i += 5) {
        const bucketDays = days.slice(i, i + 5);
        const bucketStart = bucketDays[0];
        const bucketEnd = bucketDays[bucketDays.length - 1];
        const casesInBucket = casos.filter(c => {
          const cd = new Date(c.created_date);
          const cdDate = new Date(cd.getFullYear(), cd.getMonth(), cd.getDate());
          const sDate = new Date(bucketStart.getFullYear(), bucketStart.getMonth(), bucketStart.getDate());
          const eDate = new Date(bucketEnd.getFullYear(), bucketEnd.getMonth(), bucketEnd.getDate());
          return cdDate >= sDate && cdDate <= eDate;
        });
        const label = `${bucketStart.getDate()}/${bucketStart.getMonth() + 1} - ${bucketEnd.getDate()}/${bucketEnd.getMonth() + 1}`;
        buckets.push({
          name: label,
          value: casesInBucket.reduce((s, c) => s + (c.valor_patrimonio || 0), 0),
          active: bucketDays.some(d => d.getDate() === today.getDate() && d.getMonth() === today.getMonth()),
        });
      }
      return buckets;
    }

    if (period === "6m") {
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        return d;
      });
      return months.map(date => {
        const monthName = date.toLocaleString('pt-BR', { month: 'short' });
        const casesInMonth = casos.filter(c => {
          const cd = new Date(c.created_date);
          return cd.getMonth() === date.getMonth() && cd.getFullYear() === date.getFullYear();
        });
        return {
          name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          value: casesInMonth.reduce((s, c) => s + (c.valor_patrimonio || 0), 0),
          active: date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(),
        };
      });
    }

    if (period === "1y") {
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        return d;
      });
      return months.map(date => {
        const monthName = date.toLocaleString('pt-BR', { month: 'short' });
        const casesInMonth = casos.filter(c => {
          const cd = new Date(c.created_date);
          return cd.getMonth() === date.getMonth() && cd.getFullYear() === date.getFullYear();
        });
        return {
          name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          value: casesInMonth.reduce((s, c) => s + (c.valor_patrimonio || 0), 0),
          active: date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(),
        };
      });
    }

    return [];
  }, [casos, period]);

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h3 className="font-bold text-[#1a237e] text-lg">Distribuição Patrimonial e Evolução</h3>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {PERIOD_OPTIONS.map(opt => (
              <Button
                key={opt.key}
                variant={period === opt.key ? "default" : "ghost"}
                size="sm"
                className={`text-xs h-7 px-3 rounded-md ${
                  period === opt.key
                    ? "bg-[#1a237e] text-white hover:bg-[#151b60] shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => setPeriod(opt.key)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={period === "1y" ? 28 : 40}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                dy={10}
                interval={0}
                angle={period === "1m" || period === "1y" ? -20 : 0}
                textAnchor={period === "1m" || period === "1y" ? "end" : "middle"}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={formatCurrency}
                width={70}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Patrimônio']}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.active ? '#D4AF37' : entry.value > 0 ? '#5c6bc0' : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}