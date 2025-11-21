import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

export default function TabelaCertidoes({ certidoes }) {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-700 border-0">Válida</Badge>;
      case 'expiring':
        return <Badge className="bg-amber-100 text-amber-700 border-0">Vencendo em Breve</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 border-0">Vencida/Com Débito</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="bg-slate-50 border-b-2 border-slate-200">
        <CardTitle className="text-[#333333]">Painel de Status das Certidões</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b-2 border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Esfera/Nível</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Nome da Certidão</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">CNPJ/CPF</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Data Emissão</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Validade</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {certidoes.map((cert) => (
                <tr key={cert.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <Badge variant="outline">{cert.esfera}</Badge>
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#333333]">{cert.nome}</td>
                  <td className="px-4 py-4 text-sm text-[#AAAAAA]">{cert.cnpj}</td>
                  <td className="px-4 py-4 text-sm text-[#AAAAAA]">
                    {new Date(cert.emissao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-[#333333] font-medium">
                        {new Date(cert.validade).toLocaleDateString('pt-BR')}
                      </p>
                      <p className={`text-xs ${cert.diasRestantes > 0 ? 'text-[#AAAAAA]' : 'text-red-600 font-bold'}`}>
                        {cert.diasRestantes > 0 ? `vence em ${cert.diasRestantes} dias` : `venceu há ${Math.abs(cert.diasRestantes)} dias`}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(cert.status)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="w-8 h-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="w-8 h-8">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}