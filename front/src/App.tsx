import { useState } from 'react';
import { EmailLogin } from './components/EmailLogin';
import { ChatInterface } from './components/ChatInterface';

/**
 * App bootstraps an email-based session. If there is an active session
 * for the email, it reuses it; otherwise it creates one.
 */
function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setSessionId(`session-${Date.now()}`);
  };

  const handleLogout = () => {
    setUserEmail(null);
    setSessionId(null);
  };

  if (!userEmail || !sessionId) {
    return <EmailLogin onEmailSubmit={handleEmailSubmit} />;
  }

  return (
    <ChatInterface
      userEmail={userEmail}
      sessionId={sessionId}
      onLogout={handleLogout}
    />
  );
}

export default App;
