import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import CepInput from "@/components/novocaso/CepInput";

/**
 * Componente reutilizável de endereço padronizado.
 * 
 * Props:
 * - prefix: string - prefixo para IDs únicos (ex: "falecido", "conjuge", "herdeiro_0")
 * - values: object - { cep, logradouro, numero, bairro, cidade, uf }
 * - onChange: (field, value) => void - callback para atualizar um campo
 * - onAddressFound: (addressData) => void - callback quando CEP retorna endereço completo
 * - readOnly: boolean - se os campos são somente leitura
 */
export default function AddressInput({ prefix = "", values = {}, onChange, onAddressFound, readOnly = false }) {
  const id = (field) => prefix ? `${prefix}_${field}` : field;

  const handleAddressFound = (addressData) => {
    if (onAddressFound) {
      onAddressFound(addressData);
    } else {
      onChange("logradouro", addressData.logradouro);
      onChange("bairro", addressData.bairro);
      onChange("cidade", addressData.cidade);
      onChange("uf", addressData.uf);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_100px] gap-4">
        <CepInput
          id={id("cep")}
          label="CEP"
          cepValue={values.cep || ""}
          onCepChange={(val) => onChange("cep", val)}
          onAddressFound={handleAddressFound}
        />
        <div className="space-y-2">
          <Label htmlFor={id("logradouro")}>Logradouro</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id={id("logradouro")}
              className="pl-10"
              value={values.logradouro || ""}
              onChange={(e) => onChange("logradouro", e.target.value)}
              placeholder="Rua, Avenida..."
              readOnly={readOnly}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={id("numero")}>Número</Label>
          <Input
            id={id("numero")}
            value={values.numero || ""}
            onChange={(e) => onChange("numero", e.target.value)}
            placeholder="Nº"
            readOnly={readOnly}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={id("bairro")}>Bairro</Label>
          <Input
            id={id("bairro")}
            value={values.bairro || ""}
            onChange={(e) => onChange("bairro", e.target.value)}
            placeholder="Bairro"
            readOnly={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id("cidade")}>Cidade</Label>
          <Input
            id={id("cidade")}
            value={values.cidade || ""}
            onChange={(e) => onChange("cidade", e.target.value)}
            placeholder="Cidade"
            readOnly={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={id("uf")}>UF</Label>
          <Input
            id={id("uf")}
            value={values.uf || ""}
            onChange={(e) => onChange("uf", e.target.value.toUpperCase())}
            placeholder="SP"
            readOnly={readOnly}
            maxLength={2}
          />
        </div>
      </div>
    </div>
  );
}