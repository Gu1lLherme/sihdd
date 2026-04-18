import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Valida se o CPF informado já está em uso por outra parte no caso.
 * Recebe o CPF atual e o formData completo para buscar duplicatas.
 * ownerLabel identifica quem é o "dono" deste campo para não comparar consigo mesmo.
 * infoOnly=true → exibe como aviso neutro (azul), sem bloquear. Útil quando o Adm. Provisório
 * pode ser o cônjuge, um herdeiro ou terceiro (CPF pode coincidir propositalmente).
 */
export default function CpfUnicoValidator({ cpf, formData, ownerLabel, infoOnly = false }) {
  if (!cpf || cpf.replace(/\D/g, "").length !== 11) return null;

  const cleaned = cpf.replace(/\D/g, "");
  const duplicatas = [];

  // Checar CPF do falecido
  if (ownerLabel !== "falecido" && formData.cpf_falecido?.replace(/\D/g, "") === cleaned) {
    duplicatas.push("Falecido");
  }

  // Checar CPF do cônjuge
  if (ownerLabel !== "conjuge" && formData.conjuge_cpf?.replace(/\D/g, "") === cleaned) {
    duplicatas.push("Cônjuge");
  }

  // Checar CPF do administrador provisório
  const adm = formData.administrador_provisorio || {};
  if (ownerLabel !== "admin" && adm.cpf?.replace(/\D/g, "") === cleaned) {
    duplicatas.push("Adm. Provisório");
  }
  if (ownerLabel !== "admin_conjuge" && adm.conjuge_cpf?.replace(/\D/g, "") === cleaned) {
    duplicatas.push("Cônjuge do Adm.");
  }

  // Checar CPF dos herdeiros
  (formData.herdeiros || []).forEach((h, i) => {
    const hLabel = `herdeiro_${i}`;
    if (ownerLabel !== hLabel && h.cpf?.replace(/\D/g, "") === cleaned) {
      duplicatas.push(`Herdeiro ${i + 1} (${h.nome || "sem nome"})`);
    }
  });

  // Checar CPF do inventariante
  const inv = formData.inventariante || {};
  if (ownerLabel !== "inventariante" && inv.cpf_cnpj?.replace(/\D/g, "") === cleaned) {
    duplicatas.push("Inventariante");
  }

  if (duplicatas.length === 0) return null;

  const colorClasses = infoOnly
    ? { icon: "text-blue-500", text: "text-blue-600" }
    : { icon: "text-red-500", text: "text-red-500" };
  const prefix = infoOnly ? "Mesma pessoa que: " : "CPF já utilizado por: ";

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${colorClasses.icon}`} />
      <p className={`text-xs ${colorClasses.text}`}>
        {prefix}{duplicatas.join(", ")}
      </p>
    </div>
  );
}