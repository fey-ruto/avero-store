'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Role = '1' | '2';
const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
const strongPass = (s: string) => s.length >= 6;

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [message, setMessage] = useState('');

  // shared
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // register-only
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('2');

  useEffect(() => setMessage(''), [mode]);

  async function setSessionCookie(email: string) {
    try {
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {}
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !country || !city || !phone) return setMessage('Please fill all fields.');
    if (!isEmail(email)) return setMessage('Enter a valid email.');
    if (!strongPass(password)) return setMessage('Password must be at least 6 characters.');

    // 1) create auth user
    const { data: signUp, error: signUpErr } = await supabase.auth.signUp({ email, password });
    if (signUpErr) return setMessage(signUpErr.message);

    // 2) if user exists now (email confirmation off or already confirmed), insert profile
    const user = signUp.user;
    if (user) {
      const { error: profErr } = await supabase.from('profiles').insert({
        id: user.id, name, country, city, phone_number: phone, role
      });
      if (profErr) return setMessage(profErr.message);

      await setSessionCookie(email);
      window.location.href = '/dashboard';
      return;
    }

    // otherwise they must confirm email first
    setMessage('Check your email to confirm, then log in.');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return setMessage('Please fill all fields.');
    if (!isEmail(email)) return setMessage('Enter a valid email.');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMessage(error.message);

    await setSessionCookie(email);
    window.location.href = '/dashboard';
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Hustle Village</h1>
      <div className="flex gap-2">
        <button onClick={() => setMode('register')} className={mode==='register' ? 'border-2' : ''}>Register</button>
        <button onClick={() => setMode('login')} className={mode==='login' ? 'border-2' : ''}>Login</button>
      </div>

      {mode === 'register' ? (
        <form onSubmit={handleRegister} className="card space-y-3">
          {message && <p className="text-red-600">{message}</p>}
          <div className="grid grid-cols-1 gap-3">
            <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <input placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)} />
            <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
            <input placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)} />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="role" checked={role==='1'} onChange={()=>setRole('1')} /> Admin
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="role" checked={role==='2'} onChange={()=>setRole('2')} /> Customer
              </label>
            </div>
          </div>
          <button type="submit">Create account</button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="card space-y-3">
          {message && <p className="text-red-600">{message}</p>}
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit">Log in</button>
        </form>
      )}

      <p className="text-sm opacity-70">
        Accounts are stored in Supabase (Auth + profiles).
      </p>
    </main>
  );
}
