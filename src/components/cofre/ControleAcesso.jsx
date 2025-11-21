import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

export default function ControleAcesso({ masterPassword, setMasterPassword }) {
  return (
    <>
      {/* Security Notice */}
      <Card className="border-2 border-[#4169E1] bg-blue-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#4169E1]" />
            <div>
              <p className="font-bold text-[#333333]">Ambiente com Criptografia Ponta a Ponta</p>
              <p className="text-sm text-[#AAAAAA]">
                Todos os dados são criptografados usando AES-256 e acessíveis apenas com sua senha mestra
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Master Password Input */}
      <Card className="border-2 border-slate-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="master-password">Senha Mestra (necessária para visualizar)</Label>
              <Input
                id="master-password"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Digite sua senha mestra"
              />
            </div>
            <Badge className="bg-green-100 text-green-700 border-0 whitespace-nowrap">
              {masterPassword ? "Desbloqueado" : "Bloqueado"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}