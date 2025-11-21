import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function GraficoImpacto({ chartData, economia, totalInventario }) {
  return (
    <Card className="border-2 border-[#FFC107] bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardHeader className="border-b-2 border-[#FFC107]">
        <CardTitle className="flex items-center gap-2 text-[#333333]">
          <PieChartIcon className="w-6 h-6 text-[#FFC107]" />
          Análise de Impacto Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <p className="text-white text-lg font-bold mb-2">Economia Gerada</p>
              <p className="text-5xl font-extrabold text-white mb-4">
                R$ {economia.toLocaleString('pt-BR')}
              </p>
              <p className="text-green-100 text-sm">
                {economia > 0 ? `Economize ${((economia/totalInventario)*100).toFixed(1)}% escolhendo Holding` : 'Inventário tradicional é mais barato neste caso'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}