import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { masks } from "@/components/Masks";
import { FieldError } from "@/components/validations";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function CepInput({ 
  id, 
  label = "CEP", 
  cepValue, 
  onCepChange, 
  onAddressFound 
}) {
  // onAddressFound receives an object: { logradouro, bairro, cidade, uf }
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const fetchAddress = useCallback(async (cep) => {
    const cleaned = cep.replace(/\D/g, "");
    if (cleaned.length !== 8) return;

    setLoading(true);
    setError("");
    setFound(false);

    const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    const data = await response.json();

    setLoading(false);

    if (data.erro) {
      setError("CEP não encontrado");
      return;
    }

    setFound(true);
    setTimeout(() => setFound(false), 3000);

    onAddressFound({
      logradouro: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      uf: data.uf || "",
    });
  }, [onAddressFound]);

  const handleChange = (e) => {
    const masked = masks.cep(e.target.value);
    onCepChange(masked);

    const cleaned = masked.replace(/\D/g, "");
    if (cleaned.length === 8) {
      fetchAddress(masked);
    } else {
      setFound(false);
      setError("");
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          value={cepValue || ""}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="00000-000"
          maxLength={9}
          className={found ? "border-green-400 pr-9" : error ? "border-red-400 pr-9" : ""}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
        )}
        {found && !loading && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
      </div>
      {touched && <FieldError value={cepValue} validator="cep" />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {found && <p className="text-xs text-green-600">Endereço preenchido automaticamente</p>}
    </div>
  );
}