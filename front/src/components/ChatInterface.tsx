import { useEffect, useRef, useState } from 'react';
import { LogOut, Send, User } from 'lucide-react';
import { ChatMessage, STATIC_MESSAGE_TEMPLATE } from '../data/staticMessages';
import { suportAi } from '../hooks/Api';

interface ChatInterfaceProps {
  userEmail: string;
  sessionId: string;
  onLogout: () => void;
}

// Regras simples para simular respostas do bot (lado do cliente mesmo)
function botReplyFor(text: string): string | null {
  const t = text.toLowerCase();
  if (/^oi$|ol[áa]|bom dia|boa tarde|boa noite/.test(t)) {
    return 'Olá! Sou o Bot de Suporte. Como posso ajudar?';
  }
  if (t.includes('preço') || t.includes('valor')) {
    return 'Temos planos a partir de R$ 49,90/mês. Quer que eu envie detalhes?';
  }
  if (t.includes('teste') || t.includes('demo')) {
    return 'Você já pode testar nesta própria conversa. Envie qualquer mensagem e eu respondo 😉';
  }
  if (t.includes('obrigado') || t.includes('valeu')) {
    return 'De nada! Se precisar de algo mais, estou por aqui.';
  }
  return 'Entendi. Nossa equipe pode ajudar com cadastro, integração e dúvidas gerais. O que você deseja fazer?';
}

export function ChatInterface({ userEmail, sessionId, onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;

    setIsLoading(true);
    setIsTyping(true);
    setNewMessage('');

    const userMessage: ChatMessage = {
      id: makeId('user'),
      session_id: sessionId,
      sender_email: userEmail,
      message: text,
      is_support: false,
      created_at: new Date().toISOString(),
    };   

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await suportAi({ email: userEmail, message: text });
      if (response.response) {
        const botMessage: ChatMessage = {
          id: makeId('bot'),
          session_id: sessionId,
          sender_email: 'bot@demo',
          message: response.response,
          is_support: true,
          created_at: new Date().toISOString(),
        };

        setTimeout(() => {
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          setIsLoading(false);
        }, 400);
        return;
      }
    } catch (error) {
      console.error('Erro ao enviar a mensagem para a IA:', error);
      alert('Falha ao obter resposta da IA. Tente novamente.');
    }

    setIsTyping(false);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="font-semibold">Suporte</h1>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <div className="flex-1">
        <div className="max-w-4xl mx-auto h-[calc(100vh-190px)] overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">
              Sem mensagens ainda. Envie um "oi" para começar!
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.sender_email === userEmail && !m.is_support;
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl px-4 py-2 max-w-[80%] shadow ${mine ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                    <p className="text-xs mb-1 opacity-70">
                      {m.is_support ? 'Suporte' : m.sender_email}
                    </p>
                    <p className="whitespace-pre-wrap break-words">{m.message}</p>
                  </div>
                </div>
              );
            })
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2 max-w-[80%] shadow bg-white">
                <p className="text-xs mb-1 opacity-70">Suporte</p>
                <p className="whitespace-pre-wrap break-words text-gray-500 italic">
                  Suporte está digitando...
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="border-t bg-white">
          <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escreva sua mensagem..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function makeId(prefix: string) {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}
