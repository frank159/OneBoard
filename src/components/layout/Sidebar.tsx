"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, ListTodo, Settings } from "lucide-react";

export const Sidebar = () => {
  return (
    <aside className="w-64 h-full bg-background border-r p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6">OneBoard</h2>
      <nav className="space-y-2">
        <SidebarItem href="/dashboard" icon={<Home />} label="Dashboard" />
        <SidebarItem href="/dashboard/calendar" icon={<Calendar />} label="Calendário" />
        <SidebarItem href="/dashboard/tasks" icon={<ListTodo />} label="Tarefas" />
        <SidebarItem href="/dashboard/settings" icon={<Settings />} label="Configurações" />
      </nav>
    </aside>
  );
};

const SidebarItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 p-2 rounded transition cursor-pointer 
        ${isActive ? "bg-muted font-semibold" : "hover:bg-muted"}`}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};
