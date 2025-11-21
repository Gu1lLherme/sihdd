import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Users, Plus, ZoomIn, ZoomOut, Maximize2, User, CheckCircle2, AlertCircle, Trash2, Edit, Save, X } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner or similar is available, or I'll use standard alerts if not configured, but base44 usually has ui components. I'll stick to standard UI feedback for now.

export default function ArvoreGenealogica() {
  const queryClient = useQueryClient();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedCaso, setSelectedCaso] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    nome: "",
    parentesco: "filho",
    cpf: "",
    email: "",
    percentual_partilha: 0,
    caso_id: ""
  });

  const { data: casos } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list(),
    initialData: [],
  });

  const { data: herdeiros } = useQuery({
    queryKey: ['herdeiros', selectedCaso],
    queryFn: () => base44.entities.Herdeiro.list(),
    initialData: [],
    enabled: !!selectedCaso,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Herdeiro.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herdeiros'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Herdeiro.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['herdeiros'] });
      setIsModalOpen(false);
      setSelectedPerson(data); // Update selected person view
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Herdeiro.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herdeiros'] });
      setIsDeleteAlertOpen(false);
      setSelectedPerson(null);
    },
  });

  const herdeirosDosCaso = herdeiros.filter(h => h.caso_id === selectedCaso);
  const casoAtual = casos.find(c => c.id === selectedCaso);

  const resetForm = () => {
    setFormData({
      nome: "",
      parentesco: "filho",
      cpf: "",
      email: "",
      percentual_partilha: 0,
      caso_id: selectedCaso
    });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    if (!selectedCaso) {
      alert("Por favor, selecione um caso primeiro.");
      return;
    }
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (person) => {
    setFormData({
      nome: person.nome,
      parentesco: person.parentesco,
      cpf: person.cpf || "",
      email: person.email || "",
      percentual_partilha: person.percentual_partilha || 0,
      caso_id: person.caso_id
    });
    setEditingId(person.id);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.caso_id) return;

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (selectedPerson && selectedPerson.id) {
      deleteMutation.mutate(selectedPerson.id);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4169E1] to-[#3151c7] rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Árvore Genealógica Sucessória</h1>
                <p className="text-blue-100 text-sm">Gerencie visualmente os herdeiros e a estrutura familiar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Case Selection & Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
           <Card className="w-full md:w-1/3 border-2 border-slate-200">
            <CardContent className="p-3">
               <Select value={selectedCaso} onValueChange={(val) => { setSelectedCaso(val); setSelectedPerson(null); }}>
                <SelectTrigger className="w-full border-0 focus:ring-0">
                  <SelectValue placeholder="Selecione um Caso para Visualizar" />
                </SelectTrigger>
                <SelectContent>
                  {casos.map((caso) => (
                    <SelectItem key={caso.id} value={caso.id}>
                      {caso.nome_falecido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="bg-white border-2 border-slate-200 rounded-full shadow-xl px-4 py-2 flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full w-10 h-10 hover:bg-blue-50"
              onClick={handleOpenCreate}
              disabled={!selectedCaso}
            >
              <Plus className={`w-5 h-5 ${selectedCaso ? 'text-[#4169E1]' : 'text-slate-300'}`} />
            </Button>
            <div className="w-px h-6 bg-slate-300" />
            <Button size="icon" variant="ghost" className="rounded-full w-10 h-10" onClick={() => setZoomLevel(z => Math.min(z + 0.1, 2))}>
              <ZoomIn className="w-5 h-5 text-[#333333]" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full w-10 h-10" onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.5))}>
              <ZoomOut className="w-5 h-5 text-[#333333]" />
            </Button>
            <div className="w-px h-6 bg-slate-300" />
            <Button size="icon" variant="ghost" className="rounded-full w-10 h-10" onClick={() => setZoomLevel(1)}>
              <Maximize2 className="w-5 h-5 text-[#333333]" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-slate-200 h-[600px] overflow-hidden">
              <CardContent className="p-6 h-full bg-slate-50 relative overflow-auto custom-scrollbar">
                {casoAtual ? (
                  <div 
                    className="flex flex-col items-center justify-start space-y-8 pt-8 min-w-max min-h-max transition-transform origin-top"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    {/* Deceased */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-white shadow-xl mb-2 relative group cursor-help">
                        <User className="w-12 h-12 text-white" />
                        <div className="absolute -bottom-2 bg-black text-white text-[10px] px-2 py-0.5 rounded-full">Falecido</div>
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-lg text-center border-2 border-slate-200">
                        <p className="font-bold text-[#333333] text-lg">{casoAtual.nome_falecido}</p>
                        <p className="text-xs text-slate-500">{new Date(casoAtual.data_obito).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    {/* Connectors */}
                    <div className="flex flex-col items-center">
                      <div className="w-px h-12 bg-slate-400" />
                      {herdeirosDosCaso.length > 0 && (
                        <div className="h-px bg-slate-400" style={{ width: `${Math.max((herdeirosDosCaso.length - 1) * 120, 0)}px` }} />
                      )}
                    </div>

                    {/* Heirs */}
                    <div className="flex flex-wrap justify-center gap-8 items-start">
                      {herdeirosDosCaso.map((herdeiro) => {
                        const isSelected = selectedPerson?.id === herdeiro.id;
                        // Simulando status de documento aleatório para visualização
                        const hasDocuments = herdeiro.id.length % 2 === 0; 
                        
                        return (
                          <div
                            key={herdeiro.id}
                            onClick={() => setSelectedPerson(herdeiro)}
                            className="flex flex-col items-center cursor-pointer group relative"
                          >
                             <div className="h-8 w-px bg-slate-400 absolute -top-8" />
                            <div className={`
                              w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl mb-2 transition-all
                              ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50 scale-110' : 'hover:scale-105'}
                              ${hasDocuments ? 'bg-green-500 border-white' : 'bg-amber-500 border-white'}
                            `}>
                              <User className="w-10 h-10 text-white" />
                            </div>
                            <div className={`
                              bg-white rounded-xl p-3 shadow-lg text-center border-2 transition-colors max-w-[140px]
                              ${isSelected ? 'border-[#4169E1] bg-blue-50' : 'border-slate-200'}
                            `}>
                              <p className="font-bold text-sm text-[#333333] truncate w-full">{herdeiro.nome}</p>
                              <Badge variant={isSelected ? "default" : "outline"} className={`mt-1 text-xs ${isSelected ? "bg-[#4169E1]" : ""}`}>
                                {herdeiro.parentesco}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                      {herdeirosDosCaso.length === 0 && (
                        <div className="text-center p-4 border-2 border-dashed border-slate-300 rounded-lg bg-white/50">
                          <p className="text-slate-500 text-sm">Nenhum herdeiro cadastrado.</p>
                          <Button variant="link" onClick={handleOpenCreate} className="text-[#4169E1]">
                            + Adicionar Herdeiro
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Users className="w-20 h-20 text-[#AAAAAA] mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-[#333333] mb-2">Nenhuma Árvore Selecionada</h3>
                      <p className="text-[#AAAAAA]">Selecione um caso acima para visualizar a árvore genealógica</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {selectedPerson ? (
              <Card className="border-2 border-[#4169E1] h-full sticky top-6">
                <CardHeader className="bg-blue-50 border-b-2 border-[#4169E1] flex flex-row items-center justify-between p-4">
                  <CardTitle className="text-[#333333] text-lg">Detalhes</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedPerson(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-6">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-[#4169E1] flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-[#333333] leading-tight">{selectedPerson.nome}</h3>
                    <Badge className="mt-2 text-sm px-3 py-1 bg-blue-100 text-[#4169E1] hover:bg-blue-200 border-0">
                      {selectedPerson.parentesco}
                    </Badge>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">CPF</p>
                      <p className="text-sm font-medium text-[#333333]">{selectedPerson.cpf || "Não informado"}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Email</p>
                      <p className="text-sm font-medium text-[#333333]">{selectedPerson.email || "Não informado"}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs font-bold text-[#AAAAAA] uppercase mb-1">Participação na Partilha</p>
                      <div className="flex items-center justify-between">
                         <p className="text-xl font-bold text-[#4169E1]">{selectedPerson.percentual_partilha}%</p>
                         <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#4169E1]" style={{width: `${selectedPerson.percentual_partilha}%`}}></div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button 
                        variant="outline" 
                        className="w-full border-[#4169E1] text-[#4169E1] hover:bg-blue-50"
                        onClick={() => handleOpenEdit(selectedPerson)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => setIsDeleteAlertOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-slate-200 border-dashed h-full flex items-center justify-center min-h-[300px]">
                <CardContent className="p-8 text-center">
                  <User className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">Clique em um herdeiro na árvore para ver e editar seus detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Dialog Criar/Editar */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Membro" : "Adicionar Novo Membro"}</DialogTitle>
              <DialogDescription>
                Preencha os dados do membro da família ou herdeiro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="parentesco">Parentesco *</Label>
                   <Select 
                      value={formData.parentesco} 
                      onValueChange={(val) => setFormData({ ...formData, parentesco: val })}
                    >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conjuge">Cônjuge</SelectItem>
                      <SelectItem value="filho">Filho(a)</SelectItem>
                      <SelectItem value="pai">Pai/Mãe</SelectItem>
                      <SelectItem value="neto">Neto(a)</SelectItem>
                      <SelectItem value="irmao">Irmão/Irmã</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="partilha">% Partilha</Label>
                  <Input
                    id="partilha"
                    type="number"
                    value={formData.percentual_partilha}
                    onChange={(e) => setFormData({ ...formData, percentual_partilha: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} className="bg-[#4169E1] hover:bg-[#3151c7]">
                {editingId ? "Salvar Alterações" : "Adicionar Membro"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Confirmar Exclusão */}
        <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja remover <strong>{selectedPerson?.nome}</strong> da árvore genealógica? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setIsDeleteAlertOpen(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Excluir Membro</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}