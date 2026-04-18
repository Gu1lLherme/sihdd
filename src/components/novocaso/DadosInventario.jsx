import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building2 } from "lucide-react";
import { FieldError } from "@/components/validations";
import DateAfterBirthValidator from "@/components/novocaso/DateAfterBirthValidator";
import DateAfterObitoValidator from "@/components/novocaso/DateAfterObitoValidator";

const TODAY = new Date().toISOString().split('T')[0];
const MIN_DATE = "1600-01-01";

function getNextDay(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function DadosInventario({ formData, setFormData }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const tipoInv = formData.tipo_inventario || 'extrajudicial';
  const tipoProc = formData.tipo_processo || 'inventario';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b pb-2 border-slate-200">
        <FileText className="w-5 h-5 text-blue-900" />
        <h3 className="font-bold text-xl text-blue-900">Dados do Inventário / Sobrepartilha</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Inventário *</Label>
          <Select value={tipoInv} onValueChange={(val) => handleChange('tipo_inventario', val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="extrajudicial">Extrajudicial</SelectItem>
              <SelectItem value="judicial">Judicial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo de Processo *</Label>
          <Select value={tipoProc} onValueChange={(val) => handleChange('tipo_processo', val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="inventario">Inventário</SelectItem>
              <SelectItem value="sobrepartilha">Sobrepartilha</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Extrajudicial */}
      {tipoInv === 'extrajudicial' && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-900">Dados do Inventário Extrajudicial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Data de Abertura do Inventário</Label>
              <Input
                type="date"
                min={getNextDay(formData.data_obito) || formData.data_nascimento || MIN_DATE}
                max={TODAY}
                value={formData.data_abertura_inventario || ''}
                onChange={(e) => handleChange('data_abertura_inventario', e.target.value)}
              />
              <FieldError value={formData.data_abertura_inventario} validator="datePastOnly" />
              <DateAfterObitoValidator date={formData.data_abertura_inventario} dataObito={formData.data_obito} label="Data de abertura do inventário" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Judicial */}
      {tipoInv === 'judicial' && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-indigo-900">Dados do Inventário Judicial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Distribuição</Label>
                <Input
                  type="date"
                  min={getNextDay(formData.data_obito) || formData.data_nascimento || MIN_DATE}
                  max={TODAY}
                  value={formData.data_distribuicao || ''}
                  onChange={(e) => handleChange('data_distribuicao', e.target.value)}
                />
                <FieldError value={formData.data_distribuicao} validator="datePastOnly" />
                <DateAfterObitoValidator date={formData.data_distribuicao} dataObito={formData.data_obito} label="Data de distribuição" />
              </div>
              <div className="space-y-2">
                <Label>Processo nº</Label>
                <Input
                  value={formData.numero_processo_judicial || ''}
                  onChange={(e) => handleChange('numero_processo_judicial', e.target.value)}
                  placeholder="0000000-00.0000.0.00.0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vara / Comarca</Label>
              <Input
                value={formData.vara_comarca || ''}
                onChange={(e) => handleChange('vara_comarca', e.target.value)}
                placeholder="Ex: 1ª Vara Cível / Aracaju"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Homologação da Partilha</Label>
                <Input
                  type="date"
                  value={formData.data_homologacao_partilha || ''}
                  onChange={(e) => handleChange('data_homologacao_partilha', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Data do Trânsito em Julgado</Label>
                <Input
                  type="date"
                  value={formData.data_transito_julgado || ''}
                  onChange={(e) => handleChange('data_transito_julgado', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sobrepartilha Judicial */}
      {tipoProc === 'sobrepartilha' && tipoInv === 'judicial' && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-900">Dados da Sobrepartilha Judicial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Processo de Sobrepartilha nº</Label>
                <Input
                  value={formData.numero_sobrepartilha || ''}
                  onChange={(e) => handleChange('numero_sobrepartilha', e.target.value)}
                  placeholder="Número do processo"
                />
              </div>
              <div className="space-y-2">
                <Label>Vara / Comarca</Label>
                <Input
                  value={formData.vara_comarca_sobrepartilha || ''}
                  onChange={(e) => handleChange('vara_comarca_sobrepartilha', e.target.value)}
                  placeholder="Vara e Comarca"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Homologação Sobrepartilha</Label>
                <Input
                  type="date"
                  value={formData.data_homologacao_sobrepartilha || ''}
                  onChange={(e) => handleChange('data_homologacao_sobrepartilha', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Trânsito em Julgado</Label>
                <Input
                  type="date"
                  value={formData.data_transito_julgado_sobrepartilha || ''}
                  onChange={(e) => handleChange('data_transito_julgado_sobrepartilha', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cessão e Renúncia agora são individuais por herdeiro (ver etapa "Herdeiros") */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
        ℹ️ <b>Cessão de Direitos</b> e <b>Renúncia Abdicativa</b> agora são informadas individualmente para
        cada herdeiro, na etapa <b>"Herdeiros"</b>.
      </div>

      {/* Dados do Cartório (Extrajudicial) */}
      {tipoInv === 'extrajudicial' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Dados do Cartório (obrigatório para extrajudicial)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nome do Cartório</Label>
                <Input
                  value={formData.cartorio_nome || ''}
                  onChange={(e) => handleChange('cartorio_nome', e.target.value)}
                  placeholder="Nome completo do cartório"
                />
              </div>
              <div className="space-y-2">
                <Label>Município</Label>
                <Input
                  value={formData.cartorio_municipio || ''}
                  onChange={(e) => handleChange('cartorio_municipio', e.target.value)}
                  placeholder="Município"
                />
              </div>
              <div className="space-y-2">
                <Label>Ofício</Label>
                <Input
                  value={formData.cartorio_comarca || ''}
                  onChange={(e) => handleChange('cartorio_comarca', e.target.value)}
                  placeholder="Ofício"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Civil do Falecido */}
      <div className="space-y-2">
        <Label>Estado Civil do Falecido</Label>
        <Select
          value={formData.estado_civil || ""}
          onValueChange={(val) => handleChange('estado_civil', val)}
        >
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="solteiro">Solteiro(a)</SelectItem>
            <SelectItem value="casado">Casado(a)</SelectItem>
            <SelectItem value="divorciado">Divorciado(a)</SelectItem>
            <SelectItem value="viuvo">Viúvo(a)</SelectItem>
            <SelectItem value="uniao_estavel">União Estável</SelectItem>
            <SelectItem value="separado_judicialmente">Separado(a) Judicialmente</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}