import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle2, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#1e3a5f', '#2d5a8f', '#4a7bb7', '#6a9dd4', '#8bb8e8'];

export default function CalculoITCMD({ bens, herdeiros, calculoFeito, onCalcular }) {
  const totalPatrimonio = bens.reduce((sum, b) => sum + (parseFloat(b.valor) || 0), 0);
  const aliquota = 4;
  const totalITCMD = (totalPatrimonio * aliquota) / 100;

  const chartData = herdeiros.map((h, index) => ({
    name: h.nome,
    value: h.valor_parte || 0,
    percentual: h.percentual_partilha || 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2 flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Cálculo do ITCMD
        </h2>
        <p className="text-slate-600">
          Simulação automática do Imposto de Transmissão Causa Mortis
        </p>
      </div>

      {!calculoFeito ? (
        <Card className="p-12 text-center border-2 border-dashed border-[#1e3a5f]">
          <Calculator className="w-20 h-20 mx-auto mb-4 text-[#1e3a5f]" />
          <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">
            Pronto para calcular
          </h3>
          <p className="text-slate-600 mb-6">
            Clique no botão "Calcular ITCMD" abaixo para gerar a simulação
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>✓ Legislação SEFAZ/SE aplicada</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 font-medium">Patrimônio Total</p>
                  <p className="text-2xl font-bold text-[#1e3a5f]">
                    {totalPatrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 font-medium">Alíquota Aplicável</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aliquota}%
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 font-medium">ITCMD Total</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {totalITCMD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">
              Distribuição por Herdeiro
            </h3>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-[#1e3a5f]">Beneficiário</TableHead>
                    <TableHead className="font-semibold text-[#1e3a5f]">Parentesco</TableHead>
                    <TableHead className="font-semibold text-[#1e3a5f]">Percentual</TableHead>
                    <TableHead className="font-semibold text-[#1e3a5f]">Valor da Parte</TableHead>
                    <TableHead className="font-semibold text-[#1e3a5f]">ITCMD Devido (4%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {herdeiros.map((herdeiro, index) => (
                    <TableRow key={index} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium">{herdeiro.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {herdeiro.parentesco?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{herdeiro.percentual_partilha}%</TableCell>
                      <TableCell className="font-semibold text-[#1e3a5f]">
                        {herdeiro.valor_parte?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell className="font-bold text-amber-600">
                        {herdeiro.valor_itcmd?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-100 font-bold">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-[#1e3a5f]">
                      {totalPatrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell className="text-amber-600">
                      {totalITCMD.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>

          {chartData.length > 0 && (
            <Card className="p-6 border-slate-200">
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">
                Visualização da Partilha
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentual }) => `${name} (${percentual}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
    </div>
  );
}