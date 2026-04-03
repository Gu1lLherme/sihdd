import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

export default function FileUpload({ value, onChange, label, accept, multiple = false, maxFiles, className = "" }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const urls = multiple
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (value ? [value] : []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const uploaded = [];

    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploaded.push(file_url);
    }

    if (multiple) {
      onChange([...urls, ...uploaded]);
    } else {
      onChange(uploaded[0]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    if (multiple) {
      onChange(urls.filter((_, i) => i !== index));
    } else {
      onChange("");
    }
  };

  const getFileName = (url) => {
    if (!url) return "Arquivo";
    const parts = url.split("/");
    const name = parts[parts.length - 1];
    return decodeURIComponent(name).substring(0, 40) || "Arquivo";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept || "*/*"}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {urls.length > 0 && (
        <div className="space-y-1.5">
          {urls.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate flex-1 text-emerald-800">{getFileName(url)}</span>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        disabled={uploading || (maxFiles && urls.length >= maxFiles)}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {label || "Anexar Documento"}
          </>
        )}
      </Button>
    </div>
  );
}