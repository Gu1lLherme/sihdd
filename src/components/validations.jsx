// Funções de validação para formulários jurídicos

export const validators = {
  cpf: (value) => {
    if (!value) return { valid: true, message: "" }; // não obrigatório por padrão
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length !== 11) return { valid: false, message: "CPF deve ter 11 dígitos" };
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleaned)) return { valid: false, message: "CPF inválido" };
    
    // Validação dos dígitos verificadores
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