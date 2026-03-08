import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Download } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function BotaoDeclaracaoSEFAZ({ casoId, casoNumero }) {
  const [gerando, setGerando] = useState(false);

  const gerarDeclaracao = async () => {
    setGerando(true);
    try {
      const response = await base44.functions.invoke('gerarDeclaracaoSEFAZ', {
        caso_id: casoId
      });

      const { file_url, filename } = response.data;
      
      // Abre o PDF em nova aba para download
      const a = document.createElement('a');
      a.href = file_url;
      a.download = filename || `Declaracao_ITCMD_${casoNumero || casoId}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Declaração SEFAZ gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar declaração:", error);
      toast.error("Erro ao gerar declaração. Verifique os dados do caso.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <Button
      onClick={gerarDeclaracao}
      disabled={gerando}
      className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
    >
      {gerando ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          Gerar Declaração SEFAZ
        </>
      )}
    </Button>
  );
}