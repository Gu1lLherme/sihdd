import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, EyeOff } from "lucide-react";

export default function GridAtivos({ 
  ATIVOS_DIGITAIS_MOCK, 
  revealed, 
  handleReveal, 
  showNewAsset, 
  setShowNewAsset 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Add New Asset Card */}
      <Dialog open={showNewAsset} onOpenChange={setShowNewAsset}>
        <DialogTrigger asChild>
          <Card className="border-2 border-dashed border-slate-300 cursor-pointer hover:border-[#4169E1] transition-colors">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-64">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-10 h-10 text-[#AAAAAA]" />
              </div>
              <p className="font-bold text-[#333333]">Adicionar Ativo Digital</p>
              <p className="text-sm text-[#AAAAAA] text-center mt-2">
                Armazene credenciais, chaves cripto ou acesso a redes sociais
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Ativo Digital</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="platform">Plataforma</Label>
              <Input id="platform" placeholder="ex: Gmail, Instagram" />
            </div>
            <div>
              <Label htmlFor="username">Usuário/Email</Label>
              <Input id="username" placeholder="usuario@exemplo.com" />
            </div>
            <div>
              <Label htmlFor="password">Senha/Frase Semente</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input id="notes" placeholder="Informações adicionais" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewAsset(false)}>
                Cancelar
              </Button>
              <Button className="flex-1 bg-[#4169E1] hover:bg-[#3151c7] text-white">
                Salvar Ativo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Existing Assets */}
      {ATIVOS_DIGITAIS_MOCK.map((asset) => {
        const Icon = asset.icon;
        const isRevealed = revealed[asset.id];

        return (
          <Card key={asset.id} className="border-2 border-slate-200">
            <CardHeader className="bg-slate-50 border-b-2 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4169E1] rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[#333333]">{asset.platform}</CardTitle>
                  <Badge variant="outline" className="mt-1">{asset.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-xs text-[#AAAAAA] uppercase">Usuário/Email</Label>
                <p className="font-bold text-[#333333] mt-1">{asset.username}</p>
              </div>
              
              <div>
                <Label className="text-xs text-[#AAAAAA] uppercase">Senha/Chave</Label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="flex-1 font-mono text-[#333333] bg-slate-100 px-3 py-2 rounded-lg">
                    {isRevealed ? "MySecurePassword123!" : asset.password}
                  </p>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleReveal(asset.id)}
                    className="flex-shrink-0"
                  >
                    {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-[#AAAAAA]">
                  Último acesso: <span className="font-bold text-[#333333]">Nunca</span>
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}