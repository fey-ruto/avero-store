'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = { name: string; email: string; country: string; city: string; phone_number: string; role: '1'|'2'; password: string };

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('hv_users');
  return raw ? JSON.parse(raw) : [];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('hv_session');
    if (!s) {
      window.location.href = '/';
      return;
    }
    const { email } = JSON.parse(s);
    const u = getUsers().find(u => u.email === email) || null;
    setUser(u);
  }, []);

  function logout() {
    localStorage.removeItem('hv_session');
    window.location.href = '/';
  }

  if (!user) return <main className="p-6">Loading...</main>;

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="card space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role === '1' ? 'Admin' : 'Customer'}</p>
        <p><strong>Country/City:</strong> {user.country} / {user.city}</p>
        <p><strong>Phone:</strong> {user.phone_number}</p>
      </div>

      <p className="text-sm opacity-70">
        Replace this page with your real app once you wire a database or API.
      </p>
      <Link href="/" className="underline">Back to Auth</Link>
    </main>
  );
}
