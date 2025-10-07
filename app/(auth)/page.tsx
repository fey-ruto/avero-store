'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Role = '1' | '2'; // 1=Admin, 2=Customer (from your PHP)

type User = {
  name: string;
  email: string;
  password: string;
  country: string;
  city: string;
  phone_number: string;
  role: Role;
};

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('hv_users');
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: User[]) {
  localStorage.setItem('hv_users', JSON.stringify(users));
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [message, setMessage] = useState<string>('');

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register-only fields
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('2');

  useEffect(() => {
    setMessage('');
  }, [mode]);

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !country || !city || !phone) {
      setMessage('Please fill all fields.');
      return;
    }
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      setMessage('Email already registered.');
      return;
    }
    const user: User = { name, email, password, country, city, phone_number: phone, role };
    users.push(user);
    saveUsers(users);
    localStorage.setItem('hv_session', JSON.stringify({ email }));
    window.location.href = '/dashboard';
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please fill all fields.');
      return;
    }
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      setMessage('Invalid email or password.');
      return;
    }
    localStorage.setItem('hv_session', JSON.stringify({ email }));
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
        Demo only — accounts are stored in your browser (localStorage). You can add a real database later.
      </p>
    </main>
  );
}
