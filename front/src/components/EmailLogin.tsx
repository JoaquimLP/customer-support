import { useState } from 'react';
import { Mail } from 'lucide-react';

interface EmailLoginProps {
  onEmailSubmit: (email: string) => void;
}

export function EmailLogin({ onEmailSubmit }: EmailLoginProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError('');
    onEmailSubmit(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold">Suporte — Iniciar Chat</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seu e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          >
            Iniciar Chat
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Ao iniciar o chat, você concorda em compartilhar seu e-mail para fins de suporte.
          </p>
        </div>
      </div>
    </div>
  );
}