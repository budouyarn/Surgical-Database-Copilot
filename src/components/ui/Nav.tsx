'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, Users, ClipboardList, Bot } from 'lucide-react';

const links = [
  { href: '/surgeons', label: 'Surgeons', icon: Users },
  { href: '/cases', label: 'Cases', icon: ClipboardList },
  { href: '/copilot', label: 'Copilot', icon: Bot },
];

export default function Nav() {
  const pathname = usePathname();
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
      </div>
    </nav>
  );
}
