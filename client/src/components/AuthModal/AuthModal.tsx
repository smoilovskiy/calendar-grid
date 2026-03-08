import { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../../contexts/AuthContext';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Box = styled.div`
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 24px;
  min-width: 300px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
`;

const Tabs = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  font-size: 0.9rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? '#2563eb' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--text)' : 'var(--text-muted)')};
  cursor: pointer;
  margin-bottom: -1px;
  &:hover {
    color: var(--text);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--text);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  box-sizing: border-box;
  margin-bottom: 14px;
`;

const ErrorMsg = styled.div`
  font-size: 0.8rem;
  color: #c24141;
  margin-bottom: 12px;
  min-height: 20px;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  &:hover {
    background: #1d4ed8;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

type AuthModalProps = {
  onClose: () => void;
};

export function AuthModal({ onClose }: AuthModalProps) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const em = email.trim();
    const pw = password;
    if (!em || !pw) {
      setError('Email and password required');
      return;
    }
    if (mode === 'signup') {
      const n = name.trim();
      if (!n) {
        setError('Name is required');
        return;
      }
    }
    if (pw.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp(em, pw, name.trim());
      } else {
        await signIn(em, pw);
      }
      onClose();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : 'Something went wrong';
      if (message.includes('email-already-in-use')) {
        setError('This email is already registered. Sign in instead.');
      } else if (message.includes('invalid-credential') || message.includes('wrong-password')) {
        setError('Invalid email or password.');
      } else if (message.includes('invalid-email')) {
        setError('Invalid email address.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Tabs>
          <Tab type="button" $active={mode === 'signin'} onClick={() => { setMode('signin'); setError(''); }}>
            Sign in
          </Tab>
          <Tab type="button" $active={mode === 'signup'} onClick={() => { setMode('signup'); setError(''); }}>
            Sign up
          </Tab>
        </Tabs>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <Label htmlFor="auth-name">Name</Label>
              <Input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={submitting}
              />
            </>
          )}
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={submitting}
          />
          <Label htmlFor="auth-password">Password</Label>
          <Input
            id="auth-password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'Min 6 characters' : ''}
            disabled={submitting}
          />
          <ErrorMsg>{error}</ErrorMsg>
          <SubmitBtn type="submit" disabled={submitting}>
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </SubmitBtn>
        </form>
      </Box>
    </Overlay>
  );
}
