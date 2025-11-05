export interface ChatMessage {
  id: string;
  session_id: string;
  sender_email: string;
  message: string;
  is_support: boolean;
  created_at: string;
}

/**
 * Mensagens usadas apenas para preencher o histórico inicial enquanto
 * validamos a interface sem backend.
 */
export const STATIC_MESSAGE_TEMPLATE: Omit<ChatMessage, 'id' | 'session_id' | 'created_at'>[] = [
  {
    sender_email: 'suporte@empresa',
    message: 'Olá! Sou o Bot de Suporte. Como posso ajudar?',
    is_support: true,
  },
  {
    sender_email: 'cliente@example.com',
    message: 'Gostaria de saber mais sobre os planos disponíveis.',
    is_support: false,
  },
  {
    sender_email: 'suporte@empresa',
    message: 'Temos planos a partir de R$ 49,90/mês. Quer que eu envie detalhes?',
    is_support: true,
  },
];
