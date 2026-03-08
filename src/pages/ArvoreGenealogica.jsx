import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Users, Plus, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Imported components
import DetalhesMembro from "@/components/arvore-genealogica/DetalhesMembro";
import CanvasArvore from "@/components/arvore-genealogica/CanvasArvore";
import FormularioMembro from "@/components/arvore-genealogica/FormularioMembro";

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
            <CanvasArvore 
              casoAtual={casoAtual}
              herdeiros={herdeirosDosCaso}
              selectedPersonId={selectedPerson?._tipo || selectedPerson?.id}
              onSelectPerson={setSelectedPerson}
              onCreatePerson={handleOpenCreate}
              zoomLevel={zoomLevel}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DetalhesMembro 
              selectedPerson={selectedPerson}
              onClose={() => setSelectedPerson(null)}
              onEdit={handleOpenEdit}
              onDelete={() => setIsDeleteAlertOpen(true)}
            />
          </div>
        </div>

        {/* Form Dialog */}
        <FormularioMembro 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isEditing={!!editingId}
        />

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