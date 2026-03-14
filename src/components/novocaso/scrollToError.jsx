/**
 * Rola até o campo com erro, destaca e aplica shake.
 * @param {string} fieldId - O ID do elemento HTML do campo com erro
 */
export function scrollToError(fieldId) {
  if (!fieldId) return;
  
  const el = document.getElementById(fieldId);
  if (!el) return;

  // Scroll suave até o campo
  el.scrollIntoView({ behavior: "smooth", block: "center" });

  // Destacar com animação shake + borda vermelha
  el.classList.add("field-error-shake", "ring-2", "ring-red-500");
  el.focus();

  // Remover após a animação
  setTimeout(() => {
    el.classList.remove("field-error-shake", "ring-2", "ring-red-500");
  }, 2000);
}