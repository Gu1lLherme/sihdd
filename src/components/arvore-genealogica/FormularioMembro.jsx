import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { masks } from "@/components/Masks";

export default function FormularioMembro({ isOpen, onClose, onSubmit, formData, setFormData, isEditing }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Membro" : "Adicionar Novo Membro"}</DialogTitle>
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
              onChange={(e) => setFormData({ ...formData, cpf: masks.cpf(e.target.value) })}
              maxLength={14}
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
          <Button variant="outline" onClick={() => onClose(false)}>Cancelar</Button>
          <Button onClick={onSubmit} className="bg-[#4169E1] hover:bg-[#3151c7]">
            {isEditing ? "Salvar Alterações" : "Adicionar Membro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}