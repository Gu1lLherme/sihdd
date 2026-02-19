import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, TrendingUp, Calendar, BookOpen, Calculator, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export default function LegislacaoAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("regras");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: legislacoes = [] } = useQuery({
    queryKey: ['legislacoes'],
    queryFn: () => base44.entities.Legislacao.list('-data_publicacao'),
  });

  const { data: regras = [] } = useQuery({
    queryKey: ['regras_itcmd'],
    queryFn: () => base44.entities.RegraITCMD.list('-data_inicio_vigencia'),
  });

  const { data: historicoUFP = [] } = useQuery({
    queryKey: ['historico_ufp'],
    queryFn: () => base44.entities.HistoricoUFP.list('-ano'),
  });

  const deleteLegislacao = useMutation({
    mutationFn: (id) => base44.entities.Legislacao.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['legislacoes'])
  });

  const deleteRegra = useMutation({
    mutationFn: (id) => base44.entities.RegraITCMD.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['regras_itcmd'])
  });

  const deleteUFP = useMutation({
    mutationFn: (id) => base44.entities.HistoricoUFP.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['historico_ufp'])
  });

  const handleProcessarPDFs = async () => {
    setIsProcessing(true);
    try {
        const fileUrls = [
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/24ed1d390_lei9708-25.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/6b025aa15_lei9774-25.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/b7410f370_lei9500-24.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/1b3049cd6_lei9297-23.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/e5fddd77a_lei9113-22.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/0a12c50ee_lei8729-20.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/933319bb0_lei7943-14.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/e700afe9e_lei-8044-15.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/c85cc5c9e_lei-8070-15.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/130e2f747_lei8293-17.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/c74014262_lei8348-17.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/e4561c57c_lei8498-18.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/f54322b36_lei8520-19.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/43dbb6caa_lei8594-19.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/4dc1ba7da_lei7724-13.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/220349277_lei4433-011.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/54477a6da_lei7695-13.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/4b8ea9000_lei4433-01.pdf",
            "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/9c24a5fe5_lei2704-89.pdf"
        ];
        await base44.functions.invoke('processarLegislacao', { file_urls: fileUrls });
        queryClient.invalidateQueries(['legislacoes']);
        queryClient.invalidateQueries(['regras_itcmd']);
        queryClient.invalidateQueries(['historico_ufp']);
        alert("Processamento concluído com sucesso!");
    } catch (error) {
        console.error(error);
        alert("Erro ao processar: " + error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Base Legislativa & Regras (IA)</h1>
          <p className="text-slate-500">Gerenciamento automático de regras extraídas dos PDFs.</p>
        </div>
        <Button onClick={handleProcessarPDFs} disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700">
            <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            Reprocessar IA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Leis</p>
              <p className="text-2xl font-bold text-blue-900">{legislacoes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Calculator className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-emerald-600 font-medium">Regras</p>
              <p className="text-2xl font-bold text-emerald-900">{regras.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">UFP</p>
              <p className="text-2xl font-bold text-purple-900">{historicoUFP.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-6">
          <TabsTrigger value="regras">Regras de Cálculo</TabsTrigger>
          <TabsTrigger value="legislacao">Legislação</TabsTrigger>
          <TabsTrigger value="ufp">Histórico UFP</TabsTrigger>
        </TabsList>

        <TabsContent value="regras">
          <Card>
            <CardHeader><CardTitle>Regras de ITCMD</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {regras.map((regra) => (
                  <div key={regra.id} className="border rounded-lg p-4 bg-white shadow-sm relative group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => deleteRegra.mutate(regra.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                    <div className="mb-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold mr-2 ${regra.tipo_transmissao === 'causa_mortis' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                            {regra.tipo_transmissao === 'causa_mortis' ? 'CAUSA MORTIS' : 'DOAÇÃO'}
                        </span>
                        <span className="text-sm text-slate-500 font-medium">Ref: {regra.legislacao_referencia}</span>
                        <div className="text-xs text-slate-400 mt-1">
                            Vigência: {regra.data_inicio_vigencia} até {regra.data_fim_vigencia || 'Atual'}
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-100"><TableHead>Min (UFP)</TableHead><TableHead>Max (UFP)</TableHead><TableHead>Alíquota</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                          {regra.faixas?.map((f, i) => (
                            <TableRow key={i}>
                                <TableCell>{f.min_ufp}</TableCell>
                                <TableCell>{f.max_ufp || '∞'}</TableCell>
                                <TableCell className="font-bold">{f.aliquota}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legislacao">
          <Card>
            <CardHeader><CardTitle>Legislação</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead>Descrição</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {legislacoes.map((l) => (
                    <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.titulo}</TableCell>
                        <TableCell>{l.data_publicacao}</TableCell>
                        <TableCell><span className="text-xs bg-slate-100 px-2 py-1 rounded">{l.status}</span></TableCell>
                        <TableCell className="text-sm text-slate-500">{l.descricao}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => deleteLegislacao.mutate(l.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ufp">
          <Card>
            <CardHeader><CardTitle>Histórico UFP</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Ano</TableHead><TableHead>Valor (R$)</TableHead><TableHead>Meses</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {historicoUFP.map((u) => (
                    <TableRow key={u.id}>
                        <TableCell className="font-bold">{u.ano}</TableCell>
                        <TableCell>R$ {u.valor}</TableCell>
                        <TableCell>{u.mes_inicio} a {u.mes_fim}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => deleteUFP.mutate(u.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}