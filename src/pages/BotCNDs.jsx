import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, RefreshCw, Search } from "lucide-react";

// Imported components
import EstatisticasCertidoes from "@/components/bot-cnds/EstatisticasCertidoes";
import TabelaCertidoes from "@/components/bot-cnds/TabelaCertidoes";

const CERTIDOES_MOCK = [
  { id: 1, esfera: "Federal", nome: "CND Receita Federal", cnpj: "12.345.678/0001-90", emissao: "2025-01-15", validade: "2025-07-15", status: "valid", diasRestantes: 236 },
  { id: 2, esfera: "Federal", nome: "CND FGTS", cnpj: "12.345.678/0001-90", emissao: "2024-12-01", validade: "2025-06-01", status: "expiring", diasRestantes: 162 },
  { id: 3, esfera: "Estadual", nome: "CND SEFAZ/SE", cnpj: "12.345.678/0001-90", emissao: "2024-10-20", validade: "2025-04-20", status: "expired", diasRestantes: -14 },
  { id: 4, esfera: "Municipal", nome: "CND Prefeitura Aracaju", cnpj: "12.345.678/0001-90", emissao: "2025-01-10", validade: "2025-07-10", status: "valid", diasRestantes: 231 },
  { id: 5, esfera: "Trabalhista", nome: "CNDT TST", cnpj: "12.345.678/0001-90", emissao: "2024-11-25", validade: "2025-05-25", status: "expiring", diasRestantes: 155 },
];

export default function BotCNDs() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = {
    valid: CERTIDOES_MOCK.filter(c => c.status === 'valid').length,
    expiring: CERTIDOES_MOCK.filter(c => c.status === 'expiring').length,
    expired: CERTIDOES_MOCK.filter(c => c.status === 'expired').length,
  };

  const filteredCertidoes = CERTIDOES_MOCK.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cnpj.includes(searchTerm)
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#28A745] to-[#218838] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Robô de CNDs (Certidões Negativas)</h1>
                <p className="text-green-100 text-sm">Monitoramento automatizado de certidões fiscais</p>
              </div>
            </div>
            <Button className="bg-white text-[#28A745] hover:bg-green-50 font-bold">
              <RefreshCw className="w-4 h-4 mr-2" />
              Executar Varredura
            </Button>
          </div>
        </div>

        <EstatisticasCertidoes stats={stats} />

        {/* Search */}
        <Card className="border-2 border-slate-200 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome da certidão ou CNPJ..."
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <TabelaCertidoes certidoes={filteredCertidoes} />
      </div>
    </div>
  );
}