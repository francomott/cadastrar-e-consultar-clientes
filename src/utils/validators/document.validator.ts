export function validateCPF(cpf: string): boolean {
  // remover caracteres 
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // qtd digitos
  if (cleanCPF.length !== 11) {
    return false;
  }
  
  // validitar digitio verificados
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }
  
  // segundo digito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return false;
  }
  
  return true;
}

/**
 * Valida CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * Remove caracteres especiais e valida dígitos verificadores
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // CNPJ deve ter exatamente 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }
  
  // Valida primeiro dígito verificador
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }
  
  // Valida segundo dígito verificador
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return false;
  }
  
  return true;
}

/**
 * Valida documento (CPF ou CNPJ) baseado no tipo de pessoa
 * @param document - Documento a ser validado
 * @param person - Tipo de pessoa: 'F' para Física (CPF) ou 'J' para Jurídica (CNPJ)
 * @returns Objeto com resultado da validação e mensagem de erro (se houver)
 */
export function validateDocument(
  document: string,
  person: 'F' | 'J'
): { valid: boolean; error?: string } {
  if (!document) {
    return { valid: false, error: 'Documento é obrigatório' };
  }
  
  if (person === 'F') {
    const isValid = validateCPF(document);
    return isValid
      ? { valid: true }
      : { valid: false, error: 'CPF inválido' };
  } else if (person === 'J') {
    const isValid = validateCNPJ(document);
    return isValid
      ? { valid: true }
      : { valid: false, error: 'CNPJ inválido' };
  } else {
    return { valid: false, error: 'Tipo de pessoa inválido. Use F ou J' };
  }
}

