// Labels legíveis para os enums do backend

export const PAYMENT_LABELS: Record<string, string> = {
  CARTAO_CREDITO: 'Cartão de Crédito',
  PIX: 'Pix',
  BOLETO: 'Boleto Bancário',
};

export const PAYMENT_ICONS: Record<string, string> = {
  CARTAO_CREDITO: 'pi-credit-card',
  PIX: 'pi-qrcode',
  BOLETO: 'pi-barcode',
};

export const STATUS_LABELS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
  PAGO: 'Pago',
  EM_PREPARACAO: 'Em Preparação',
  EM_TRANSPORTE: 'Em Transporte',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export const STATUS_SEVERITY: Record<string, 'warning' | 'success' | 'info' | 'danger' | 'help' | 'secondary' | undefined> = {
  AGUARDANDO_PAGAMENTO: 'warning',
  PAGO: 'success',
  EM_PREPARACAO: 'help',
  EM_TRANSPORTE: 'info',
  CONCLUIDO: 'success',
  CANCELADO: 'danger',
};

export const STATUS_COLORS: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: '#f59e0b',
  PAGO: '#22c55e',
  EM_PREPARACAO: '#8b5cf6',
  EM_TRANSPORTE: '#3b82f6',
  CONCLUIDO: '#10b981',
  CANCELADO: '#ef4444',
};
