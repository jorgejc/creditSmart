// ============================================
// FUNCIÓN 1: Formatear números a moneda
// ============================================

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};

// ============================================
// FUNCIÓN 2: Calcular cuota mensual
// ============================================

export const calculateMonthlyPayment = (amount, term, interestRate) => {
  
  const totalInterest = (interestRate / 100) * (term / 12);

  const totalAmount = amount * (1 + totalInterest);
  
  return totalAmount / term;
};