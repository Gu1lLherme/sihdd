import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { masks } from "@/components/Masks";
import { FieldError } from "@/components/validations";
import FileUpload from "@/components/FileUpload";
import AddressInput from "@/components/AddressInput";
import { FileText, UserPlus, ArrowRightLeft, AlertCircle } from "lucide-react";

/**
 * Sub-formulário: Cessão de Direitos Hereditários + Renúncia Abdicativa,
 * por herdeiro. Substitui os antigos campos globais do Caso.
 *
 * - Cessão Onerosa: exige escritura pública + dados do cessionário (substitui o cedente).
 * - Cessão Não Onerosa: exige escritura pública (quinhão volta ao monte-mor).
 * - Renúncia: exige número do Termo Judicial ou Escritura Pública (quinhão volta ao monte-mor).
 */
export default function HerdeiroCessaoRenuncia({ herdeiro, index, updateHerdeiro, setFormData }) {
  const cessaoTipo = herdeiro.cessao_tipo || "nenhuma";
  const renunciaTipo = herdeiro.renuncia_tipo || "nenhuma";
  const temCessao = cessaoTipo !== "nenhuma";
  const temRenuncia = renunciaTipo !== "nenhuma";

  // Não permitir cessão e renúncia simultaneamente (são mutuamente exclusivas)
  const handleCessaoChange = (val) => {
    if (val !== "nenhuma" && temRenuncia) {
      updateHerdeiro(index, "renuncia_tipo", "nenhuma");
      updateHerdeiro(index, "numero_documento_renuncia", "");
    }
    updateHerdeiro(index, "cessao_tipo", val);
  };

  const handleRenunciaChange = (val) => {
    if (val !== "nenhuma" && temCessao) {
      updateHerdeiro(index, "cessao_tipo", "nenhuma");
      updateHerdeiro(index, "numero_escritura_cessao", "");
    }
    updateHerdeiro(index, "renuncia_tipo", val);
  };

  const updateCessionarioAddress = (addressData) => {
    if (!setFormData) return;
    setFormData((prev) => {
      const newH = [...prev.herdeiros];
      newH[index] = {
        ...newH[index],
        cessionario_logradouro: addressData.logradouro,
        cessionario_bairro: addressData.bairro,
        cessionario_cidade: addressData.cidade,
        cessionario_uf: addressData.uf,
      };
      return { ...prev, herdeiros: newH };
    });
  };

  return (
    <div className="mt-4 p-4 bg-amber-50/50 border border-amber-200 rounded-lg space-y-4">
      <div className="flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4 text-amber-700" />
        <p className="text-sm font-semibold text-amber-900">Cessão de Direitos / Renúncia</p>
      </div>

      {/* Cessão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Cessão de Direitos Hereditários</Label>
          <Select value={cessaoTipo} onValueChange={handleCessaoChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nenhuma">Não houve cessão</SelectItem>
              <SelectItem value="onerosa">Houve cessão ONEROSA</SelectItem>
              <SelectItem value="nao_onerosa">Houve cessão NÃO ONEROSA (gratuita)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {temCessao && (
          <div className="space-y-2">
            <Label>Nº da Escritura Pública *</Label>
            <Input
              id={`herdeiro_${index}_escritura_cessao`}
              value={herdeiro.numero_escritura_cessao || ""}
              onChange={(e) => updateHerdeiro(index, "numero_escritura_cessao", e.target.value)}
              placeholder="Número da escritura"
            />
            {!herdeiro.numero_escritura_cessao && (
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <p className="text-xs text-red-500">Obrigatório quando houver cessão</p>
              </div>
            )}
          </div>
        )}
      </div>

      {temCessao && (
        <div className="space-y-2">
          <Label>Documento da Escritura (opcional)</Label>
          <FileUpload
            value={herdeiro.documento_cessao_url || ""}
            onChange={(url) => updateHerdeiro(index, "documento_cessao_url", url)}
            label="Anexar Escritura de Cessão"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      )}

      {cessaoTipo === "nao_onerosa" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          ℹ️ Na cessão <b>não onerosa</b>, o quinhão deste herdeiro é revertido ao monte-mor e redistribuído
          entre os demais herdeiros, aumentando a base de cálculo do ITCMD de cada um.
        </div>
      )}

      {/* Cessionário (apenas quando cessão onerosa) */}
      {cessaoTipo === "onerosa" && (
        <div className="mt-2 p-4 bg-white border border-amber-300 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-700" />
            <p className="text-sm font-semibold text-amber-900">
              Cessionário (adquirente) — substitui o cedente na partilha
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Cessionário *</Label>
              <Input
                value={herdeiro.cessionario_nome || ""}
                onChange={(e) => updateHerdeiro(index, "cessionario_nome", masks.onlyLetters(e.target.value))}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label>CPF do Cessionário *</Label>
              <Input
                value={herdeiro.cessionario_cpf || ""}
                onChange={(e) => updateHerdeiro(index, "cessionario_cpf", masks.cpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              <FieldError value={herdeiro.cessionario_cpf} validator="cpf" />
            </div>
            <div className="space-y-2">
              <Label>RG do Cessionário</Label>
              <Input
                value={herdeiro.cessionario_rg || ""}
                onChange={(e) => updateHerdeiro(index, "cessionario_rg", masks.rg(e.target.value))}
                placeholder="00.000.000-0"
                maxLength={12}
              />
              <FieldError value={herdeiro.cessionario_rg} validator="rg" />
            </div>
            <div className="space-y-2">
              <Label>Email do Cessionário</Label>
              <Input
                type="email"
                value={herdeiro.cessionario_email || ""}
                onChange={(e) => updateHerdeiro(index, "cessionario_email", e.target.value)}
                placeholder="email@exemplo.com"
              />
              <FieldError value={herdeiro.cessionario_email} validator="email" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Telefone do Cessionário</Label>
              <Input
                value={herdeiro.cessionario_telefone || ""}
                onChange={(e) => updateHerdeiro(index, "cessionario_telefone", masks.phone(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
              <FieldError value={herdeiro.cessionario_telefone} validator="phone" />
            </div>
          </div>

          <AddressInput
            prefix={`herdeiro_${index}_cessionario`}
            values={{
              cep: herdeiro.cessionario_cep,
              logradouro: herdeiro.cessionario_logradouro,
              numero: herdeiro.cessionario_numero,
              bairro: herdeiro.cessionario_bairro,
              cidade: herdeiro.cessionario_cidade,
              uf: herdeiro.cessionario_uf,
            }}
            onChange={(field, value) => updateHerdeiro(index, `cessionario_${field}`, value)}
            onAddressFound={updateCessionarioAddress}
          />

          <div className="p-3 bg-amber-100 border border-amber-300 rounded text-xs text-amber-900">
            ⚖️ Na cessão <b>onerosa</b>, o cessionário assume a obrigação tributária do ITCMD causa mortis
            relativa ao quinhão cedido. O cedente deixa de ser sujeito passivo.
          </div>
        </div>
      )}

      {/* Renúncia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-amber-200">
        <div className="space-y-2">
          <Label>Renúncia Abdicativa (em favor do monte-mor)</Label>
          <Select value={renunciaTipo} onValueChange={handleRenunciaChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nenhuma">Não houve renúncia</SelectItem>
              <SelectItem value="termo_judicial">Por Termo Judicial</SelectItem>
              <SelectItem value="escritura_publica">Por Escritura Pública</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {temRenuncia && (
          <div className="space-y-2">
            <Label>
              Nº do {renunciaTipo === "termo_judicial" ? "Termo Judicial" : "Escritura Pública"} *
            </Label>
            <Input
              id={`herdeiro_${index}_doc_renuncia`}
              value={herdeiro.numero_documento_renuncia || ""}
              onChange={(e) => updateHerdeiro(index, "numero_documento_renuncia", e.target.value)}
              placeholder="Número do documento"
            />
            {!herdeiro.numero_documento_renuncia && (
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <p className="text-xs text-red-500">Obrigatório quando houver renúncia</p>
              </div>
            )}
          </div>
        )}
      </div>

      {temRenuncia && (
        <>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Documento da Renúncia (opcional)
            </Label>
            <FileUpload
              value={herdeiro.documento_renuncia_url || ""}
              onChange={(url) => updateHerdeiro(index, "documento_renuncia_url", url)}
              label="Anexar Termo / Escritura"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            ℹ️ Na <b>renúncia abdicativa</b>, o quinhão é revertido integralmente ao monte-mor. Os demais
            herdeiros da mesma classe recebem acréscimo proporcional, elevando a base de cálculo do ITCMD
            de cada um. O renunciante deixa de ser sujeito passivo.
          </div>
        </>
      )}
    </div>
  );
}