// Funções de validação para formulários jurídicos

export const validators = {
  cpf: (value) => {
    if (!value) return { valid: true, message: "" };
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 11) return { valid: false, message: "CPF deve ter 11 dígitos" };
    if (/^(\d)\1+$/.test(cleaned)) return { valid: false, message: "CPF inválido" };
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cleaned.charAt(i)) * (10 - i);
    let remainder = 11 - (sum % 11);
    let digit1 = remainder >= 10 ? 0 : remainder;
    if (parseInt(cleaned.charAt(9)) !== digit1) return { valid: false, message: "CPF inválido" };
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i)) * (11 - i);
    remainder = 11 - (sum % 11);
    let digit2 = remainder >= 10 ? 0 : remainder;
    if (parseInt(cleaned.charAt(10)) !== digit2) return { valid: false, message: "CPF inválido" };
    return { valid: true, message: "" };
  },

  rg: (value) => {
    if (!value) return { valid: true, message: "" };
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length < 5) return { valid: false, message: "RG deve ter no mínimo 5 dígitos" };
    if (cleaned.length > 9) return { valid: false, message: "RG deve ter no máximo 9 dígitos" };
    // Filtro de números repetidos
    if (/^(\d)\1+$/.test(cleaned)) return { valid: false, message: "Número de RG inválido (sequência repetida)" };
    // Validação do dígito verificador (Módulo 11 - Padrão SP) para RGs com 9 dígitos
    if (cleaned.length === 9) {
      const pesos = [2, 3, 4, 5, 6, 7, 8, 9];
      let soma = 0;
      for (let i = 0; i < 8; i++) {
        soma += parseInt(cleaned.charAt(i)) * pesos[i];
      }
      const resto = soma % 11;
      const digitoEsperado = resto === 10 ? 'X' : String(resto);
      const digitoInformado = cleaned.charAt(8);
      if (digitoInformado !== digitoEsperado && !(resto === 10 && digitoInformado === '0')) {
        return { valid: false, message: "RG Inválido. Por favor, confira os números digitados." };
      }
    }
    return { valid: true, message: "" };
  },

  nome: (value) => {
    if (!value) return { valid: true, message: "" };
    if (/\d/.test(value)) return { valid: false, message: "Nome não pode conter números" };
    if (value.trim().length < 3) return { valid: false, message: "Nome deve ter no mínimo 3 caracteres" };
    if (!/\s/.test(value.trim()) && value.trim().length > 0) return { valid: false, message: "Informe nome e sobrenome" };
    return { valid: true, message: "" };
  },

  email: (value) => {
    if (!value) return { valid: true, message: "" };
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return { valid: false, message: "Email inválido" };
    return { valid: true, message: "" };
  },

  phone: (value) => {
    if (!value) return { valid: true, message: "" };
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length < 10 || cleaned.length > 11) return { valid: false, message: "Telefone inválido" };
    return { valid: true, message: "" };
  },

  cep: (value) => {
    if (!value) return { valid: true, message: "" };
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 8) return { valid: false, message: "CEP deve ter 8 dígitos" };
    return { valid: true, message: "" };
  },

  required: (value, label) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return { valid: false, message: `${label || "Campo"} é obrigatório` };
    }
    return { valid: true, message: "" };
  },

  date: (value) => {
    if (!value) return { valid: true, message: "" };
    const date = new Date(value);
    if (isNaN(date.getTime())) return { valid: false, message: "Data inválida" };
    return { valid: true, message: "" };
  },

  datePastOnly: (value) => {
    if (!value) return { valid: true, message: "" };
    const date = new Date(value);
    if (isNaN(date.getTime())) return { valid: false, message: "Data inválida" };
    if (date > new Date()) return { valid: false, message: "Data não pode ser futura" };
    const year = date.getFullYear();
    if (year < 1600 || year > new Date().getFullYear()) return { valid: false, message: "Ano deve estar entre 1600 e " + new Date().getFullYear() };
    return { valid: true, message: "" };
  },

  matriculaCertidaoObito: (value) => {
    if (!value) return { valid: true, message: "" };
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 32) return { valid: false, message: "Matrícula deve ter exatamente 32 dígitos numéricos" };
    return { valid: true, message: "" };
  },

  currency: (value) => {
    if (!value || value === 0) return { valid: true, message: "" };
    if (typeof value === "number" && value < 0) return { valid: false, message: "Valor não pode ser negativo" };
    return { valid: true, message: "" };
  }
};

// Componente de mensagem de erro inline
export function FieldError({ value, validator, label }) {
  if (!value) return null;
  const result = typeof validator === "function" ? validator(value) : validators[validator]?.(value);
  if (!result || result.valid) return null;
  return <p className="text-xs text-red-500 mt-1">{result.message}</p>;
}