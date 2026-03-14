export const masks = {
  cpf: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },
  
  cnpj: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },

  phone: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  },

  cep: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  },

  currency: (value) => {
    if (!value) return "";
    // Ensure we have a string
    const strValue = String(value);
    // Remove all non-digits
    const onlyNums = strValue.replace(/\D/g, "");
    if (onlyNums === "") return "";
    // Divide by 100 to get decimal
    const currency = (Number(onlyNums) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return currency;
  },
  
  // Helper to parse currency string back to number for state
  currencyToNumber: (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    // Remove dots, replace comma with dot
    return Number(value.replace(/\./g, '').replace(',', '.'));
  },

  date: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  },

  plate: (value) => {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 7);
  },

  rg: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
  },

  onlyLetters: (value) => {
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
  },

  orgaoExpedidor: (value) => {
    return value.replace(/[^a-zA-Z/\-\s]/g, '').toUpperCase();
  },

  processNumber: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{7})(\d)/, '$1-$2')
      .replace(/(-\d{2})(\d)/, '$1.$2')
      .replace(/(\.\d{4})(\d)/, '$1.$2')
      .replace(/(\.\d{1})(\d)/, '$1.$2')
      .replace(/(\.\d{2})(\d)/, '$1.$2')
      .slice(0, 25);
  }
};