import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, RefreshCw, Search, CheckCircle2, AlertCircle, Clock } from "lucide-react";

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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-700 border-0">Valid</Badge>;
      case 'expiring':
        return <Badge className="bg-amber-100 text-amber-700 border-0">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 border-0">Expired/With Debt</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

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
                <h1 className="text-2xl font-bold text-white mb-1">Clearance Certificate Bot (CNDs)</h1>
                <p className="text-green-100 text-sm">Automated monitoring of tax clearance certificates</p>
              </div>
            </div>
            <Button className="bg-white text-[#28A745] hover:bg-green-50 font-bold">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Full Scan
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-2 border-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#AAAAAA] uppercase">Valid</p>
                  <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#AAAAAA] uppercase">Expiring in 5 days</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.expiring}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#AAAAAA] uppercase">Expired/With Debt</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-2 border-slate-200 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#AAAAAA]" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by certificate name or CNPJ..."
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-2 border-slate-200">
          <CardHeader className="bg-slate-50 border-b-2 border-slate-200">
            <CardTitle className="text-[#333333]">Certificate Status Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Sphere/Level</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Certificate Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Tax ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Issue Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Validity</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#333333] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertidoes.map((cert) => (
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
                            {cert.diasRestantes > 0 ? `expires in ${cert.diasRestantes} days` : `expired ${Math.abs(cert.diasRestantes)} days ago`}
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
      </div>
    </div>
  );
}