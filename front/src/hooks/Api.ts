const API_BASE_URL = 'http://localhost:3000';

export interface SupportAiPayload {
  email: string;
  message: string;
}

export interface SupportAiResponse {
  response: string;
}

/**
 * Envia a mensagem do usuário para o backend de suporte.
 */
export async function suportAi(payload: SupportAiPayload): Promise<SupportAiResponse> {
  const response = await fetch(`${API_BASE_URL}/support`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.error ?? 'Falha ao comunicar com o serviço de suporte.';
    throw new Error(errorMessage);
  }

  return data as SupportAiResponse;
}
