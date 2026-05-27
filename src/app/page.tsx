import Link from 'next/link';
import { Users, ClipboardList, Bot, ArrowRight } from 'lucide-react';

const cards = [
  {
    href: '/surgeons',
    icon: Users,
    title: 'Surgeon Database',
    description: 'Manage surgeon profiles and their surgical preference cards by procedure.',
    color: 'blue',
  },
  {
    href: '/cases',
    icon: ClipboardList,
    title: 'Operation Cases',
    description: 'Log and track surgical cases with procedure details, dates, and outcomes.',
    color: 'green',
  },
  {
    href: '/copilot',
    icon: Bot,
    title: 'AI Copilot',
    description: 'Generate preference card templates, answer case questions, and get procedure suggestions.',
    color: 'purple',
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
};

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Surgical Database Copilot</h1>
        <p className="mt-2 text-slate-500">
          A centralized platform for surgical preference cards, case management, and AI-assisted templating.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ href, icon: Icon, title, description, color }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-lg border mb-4 ${colorMap[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">{title}</h2>
            <p className="text-sm text-slate-500 mb-4">{description}</p>
            <span className="flex items-center gap-1 text-sm font-medium text-slate-700 group-hover:gap-2 transition-all">
              Open <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
