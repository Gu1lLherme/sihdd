import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { masks } from "@/components/Masks";
import FileUpload from "@/components/FileUpload";

const CATEGORIAS = {
  receita: ["Aluguel", "Dividendos", "Juros", "Rendimentos financeiros", "Outros"],
  despesa: ["IPTU", "IPVA", "Condomínio", "Manutenção / reparos", "Taxa cartorial", "Seguro", "Energia / água", "Outros"],
  venda: ["Venda extrajudicial", "Alvará judicial", "CHJ (Carta de adjudicação)", "Outros"],
  onus: ["Penhora", "Hipoteca", "Caução", "Arresto", "Outros"],
};

export default function MovimentacaoForm({ bem, casoId, userEmail, onSave, onCancel, initial = null }) {
  const [tipo, setTipo] = useState(initial?.tipo || "despesa");
  const [form, setForm] = useState({
    categoria: initial?.categoria || "",
    descricao: initial?.descricao || "",
    valor: initial?.valor || 0,
    _valorDisplay: initial?.valor ? masks.currency(String(Math.round(initial.valor * 100))) : "",
    data: initial?.data || new Date().toISOString().split("T")[0],
    responsavel: initial?.responsavel || userEmail || "",
    comprovante_url: initial?.comprovante_url || "",
    observacoes: initial?.observacoes || "",
    comprador_nome: initial?.comprador_nome || "",
    comprador_cpf: initial?.comprador_cpf || "",
    autorizacao_judicial: initial?.autorizacao_judicial || "",
    onus_credor: initial?.onus_credor || "",
    onus_status: initial?.onus_status || "ativo",
  });

  const handleSave = () => {
    if (!form.valor || form.valor <= 0) return;
    if (!form.data) return;

    const { _valorDisplay, ...cleanForm } = form;
    onSave({
      caso_id: casoId,
      bem_id: bem.id,
      tipo,
      ...cleanForm,
    });
  };

  return (
    <div className="border-2 border-blue-300 bg-blue-50/50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-blue-900">
          {initial ? "Editar Lançamento" : "Novo Lançamento"}
        </h4>
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-7 w-7">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Select value={tipo} onValueChange={(v) => { setTipo(v); setForm((f) => ({ ...f, categoria: "" })); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita (entrada)</SelectItem>
              <SelectItem value="despesa">Despesa / Manutenção</SelectItem>
              <SelectItem value="venda">Venda / Alienação</SelectItem>
              <SelectItem value="onus">Ônus (penhora, hipoteca)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={form.categoria} onValueChange={(v) => setForm((f) => ({ ...f, categoria: v }))}>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {CATEGORIAS[tipo].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Data *</Label>
          <Input
            type="date"
            value={form.data}
            onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Valor (R$) *</Label>
          <Input
            value={form._valorDisplay}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              const display = raw === "" ? "" : masks.currency(raw);
              const numValue = raw === "" ? 0 : Number(raw) / 100;
              setForm((f) => ({ ...f, valor: numValue, _valorDisplay: display }));
            }}
            placeholder="0,00"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Descrição</Label>
          <Textarea
            value={form.descricao}
            onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            placeholder="Descreva o lançamento"
            className="h-16"
          />
        </div>

        {/* Campos específicos por tipo */}
        {tipo === "venda" && (
          <>
            <div className="space-y-2">
              <Label>Comprador (nome)</Label>
              <Input
                value={form.comprador_nome}
                onChange={(e) => setForm((f) => ({ ...f, comprador_nome: masks.onlyLetters(e.target.value) }))}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label>CPF/CNPJ do Comprador</Label>
              <Input
                value={form.comprador_cpf}
                onChange={(e) => setForm((f) => ({ ...f, comprador_cpf: e.target.value }))}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Autorização Judicial / Alvará (se houver)</Label>
              <Input
                value={form.autorizacao_judicial}
                onChange={(e) => setForm((f) => ({ ...f, autorizacao_judicial: e.target.value }))}
                placeholder="Nº do alvará ou autorização"
              />
            </div>
          </>
        )}

        {tipo === "onus" && (
          <>
            <div className="space-y-2">
              <Label>Credor</Label>
              <Input
                value={form.onus_credor}
                onChange={(e) => setForm((f) => ({ ...f, onus_credor: e.target.value }))}
                placeholder="Nome do credor"
              />
            </div>
            <div className="space-y-2">
              <Label>Status do Ônus</Label>
              <Select value={form.onus_status} onValueChange={(v) => setForm((f) => ({ ...f, onus_status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="quitado">Quitado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Responsável</Label>
          <Input
            value={form.responsavel}
            onChange={(e) => setForm((f) => ({ ...f, responsavel: e.target.value }))}
            placeholder="Nome ou email"
          />
        </div>

        <div className="space-y-2">
          <Label>Observações</Label>
          <Input
            value={form.observacoes}
            onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
            placeholder="Opcional"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Comprovante (opcional)</Label>
          <FileUpload
            value={form.comprovante_url}
            onChange={(url) => setForm((f) => ({ ...f, comprovante_url: url }))}
            label="Anexar comprovante"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave} className="gap-2 bg-blue-900 hover:bg-blue-800">
          <Save className="w-4 h-4" />
          Salvar lançamento
        </Button>
      </div>
    </div>
  );
}