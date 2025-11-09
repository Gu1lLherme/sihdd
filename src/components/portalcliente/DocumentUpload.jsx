import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentUpload({ casos, userEmail }) {
  const [selectedCaso, setSelectedCaso] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const uploadPromises = files.map(async (fileObj) => {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: fileObj.file });
        
        // Registrar no log de auditoria
        await base44.entities.AuditLog.create({
          caso_id: selectedCaso,
          action_type: "create",
          entity_type: "Documento",
          entity_id: file_url,
          action_description: `Cliente enviou documento: ${fileObj.file.name}`,
          user_email: userEmail,
          user_name: "Cliente",
          new_data: {
            file_name: fileObj.file.name,
            file_size: fileObj.file.size,
            file_url: file_url,
          }
        });

        return file_url;
      });

      return await Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos-cliente'] });
      setFiles([]);
      setSelectedCaso("");
    },
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const fileObjects = droppedFiles.map(file => ({
      file,
      preview: file.name,
      size: file.size,
    }));
    
    setFiles(prev => [...prev, ...fileObjects]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const fileObjects = selectedFiles.map(file => ({
      file,
      preview: file.name,
      size: file.size,
    }));
    
    setFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (!selectedCaso || files.length === 0) return;
    uploadMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Case Selection */}
      <Card className="glassmorphism border border-slate-200 card-shadow">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2 text-[#0B1A2E]">
            <FileText className="w-5 h-5 text-[#10B981]" />
            Selecionar Caso para Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Select value={selectedCaso} onValueChange={setSelectedCaso}>
            <SelectTrigger className="border-2 border-slate-300 focus:border-[#10B981]">
              <SelectValue placeholder="Selecione o caso relacionado aos documentos" />
            </SelectTrigger>
            <SelectContent>
              {casos.map(caso => (
                <SelectItem key={caso.id} value={caso.id}>
                  Inventário de {caso.nome_falecido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Drag and Drop Area */}
      <Card className={`
        glassmorphism border-2 card-shadow-hover transition-all duration-300
        ${isDragging ? 'border-[#10B981] bg-emerald-50' : 'border-dashed border-slate-300'}
        ${!selectedCaso ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}>
        <CardContent
          className="p-12"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedCaso ? null : document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            disabled={!selectedCaso}
          />
          
          <div className="text-center">
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4
              ${isDragging 
                ? 'bg-gradient-to-br from-[#10B981] to-[#059669] scale-110' 
                : 'bg-gradient-to-br from-slate-100 to-blue-100'
              }
              transition-all duration-300
            `}>
              <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-slate-400'}`} />
            </div>
            
            <h3 className="text-xl font-bold text-[#111827] mb-2">
              {isDragging ? 'Solte os arquivos aqui' : 'Arraste e solte seus documentos'}
            </h3>
            <p className="text-[#6B7280] mb-4">
              ou clique para selecionar arquivos do seu computador
            </p>
            
            {!selectedCaso && (
              <p className="text-sm text-[#DC2626] font-semibold">
                ⚠️ Selecione um caso antes de fazer upload
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card className="glassmorphism border border-slate-200 card-shadow">
          <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="text-lg flex items-center gap-2 text-[#0B1A2E]">
              <FileText className="w-5 h-5 text-[#3B82F6]" />
              Arquivos Selecionados ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {files.map((fileObj, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-200 rounded-xl group hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827]">{fileObj.preview}</p>
                    <p className="text-xs text-[#6B7280]">
                      {(fileObj.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-[#DC2626]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}

            <Button
              onClick={handleUpload}
              disabled={uploadMutation.isPending || !selectedCaso}
              className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 font-bold"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando documentos...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Enviar {files.length} {files.length === 1 ? 'documento' : 'documentos'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {uploadMutation.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glassmorphism border-2 border-[#10B981] bg-gradient-to-r from-emerald-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] mb-1">Documentos enviados com sucesso!</h3>
                  <p className="text-sm text-[#6B7280]">
                    Seu advogado foi notificado e receberá os documentos. Você também receberá uma confirmação por e-mail.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}