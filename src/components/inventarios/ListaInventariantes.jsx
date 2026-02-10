import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCheck, Search, Edit, FileText, Trash2, Plus } from "lucide-react";
import FormInventariante from "./FormInventariante";

export default function ListaInventariantes() {
  const queryClient = useQueryClient();
  const [filtro, setFiltro] = useState("");
  const [editingInv, setEditingInv] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: inventariantes = [], isLoading } = useQuery({
    queryKey: ['inventariantes'],
    queryFn: () => base44.entities.Inventariante.list("-data_nomeacao"),
    initialData: [],
  });

  const { data: casos = [] } = useQuery({
    queryKey: ['casos'],
    queryFn: () => base44.entities.Caso.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Inventariante.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventariantes'] });
      setIsDialogOpen(false);
      setEditingInv(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Inventariante.update(data.id, data),
    onSuccess: async (data, variables) => {
      if (editingInv && variables.status !== editingInv.status) {
        await base44.entities.AuditLog.create({
          action_type: "update",
          entity_type: "Inventariante",
          entity_id: data.id,
          action_description: `Status do inventariante ${data.nome} alterado para ${data.status}`,
          user_email: "system",
          new_data: { status: data.status }
        });
      }
      queryClient.invalidateQueries({ queryKey: ['inventariantes'] });
      setIsDialogOpen(false);
      setEditingInv(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Inventariante.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventariantes'] });
    }
  });

  const filtered = inventariantes.filter(inv => 
    inv.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    inv.email.toLowerCase().includes(filtro.toLowerCase())
  );

  const getCasoNome = (id) => {
    const c = casos.find(x => x.id === id);
    return c ? (c.nome_falecido || c.numero_caso) : "N/A";
  };

  const handleSave = () => {
    if (editingInv?.id) {
      updateMutation.mutate(editingInv);
    } else {
      createMutation.mutate(editingInv);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este inventariante?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = () => {
    setEditingInv({
        nome: "",
        cpf_cnpj: "",
        email: "",
        telefone: "",
        data_nomeacao: new Date().toISOString().split('T')[0],
        vinculo: "herdeiro",
        status: "ativo",
        observacoes: ""
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar inventariante..." 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="bg-[#1a237e] hover:bg-[#151b60] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Inventariante
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Vínculo</TableHead>
                <TableHead>Caso Vinculado</TableHead>
                <TableHead>Data Nomeação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Nenhum inventariante encontrado.</TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.nome}</TableCell>
                    <TableCell className="capitalize">{inv.vinculo}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                {getCasoNome(inv.caso_id)}
                            </Badge>
                        </div>
                    </TableCell>
                    <TableCell>{new Date(inv.data_nomeacao).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === 'ativo' ? 'default' : 'secondary'} className={inv.status === 'ativo' ? 'bg-emerald-600' : ''}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                            alert("Gerar Documentos: Funcionalidade simulada. Termo de Compromisso gerado.");
                        }}>
                            <FileText className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                            setEditingInv(inv);
                            setIsDialogOpen(true);
                        }}>
                            <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(inv.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingInv?.id ? "Editar Inventariante" : "Novo Inventariante"}</DialogTitle>
            </DialogHeader>
            {editingInv && (
                <div className="space-y-4">
                    <FormInventariante 
                        data={editingInv} 
                        onChange={setEditingInv} 
                    />
                    <Button onClick={handleSave} className="w-full bg-blue-600 text-white">
                        {editingInv?.id ? "Salvar Alterações" : "Criar Inventariante"}
                    </Button>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}