'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Stethoscope, Users, ClipboardList, Bot, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const links = [
  { href: '/surgeons', label: 'Surgeons', icon: Users },
  { href: '/cases', label: 'Cases', icon: ClipboardList },
  { href: '/copilot', label: 'Copilot', icon: Bot },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  if (pathname === '/login') return null;

  async function signOut() {
    await createClient().auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          <span>Surgical Copilot</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {email && <span className="text-xs text-slate-500 hidden sm:block">{email}</span>}
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
