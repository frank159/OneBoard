"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Calendar,
  ListTodo,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{ name?: string; picture?: string }>({});

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const routes = [
    { href: "/dashboard", label: "Dashboard", icon: <Home /> },
    { href: "/dashboard/calendar", label: "Calendário", icon: <Calendar /> },
    { href: "/dashboard/tasks", label: "Tarefas", icon: <ListTodo /> },
    { href: "/dashboard/settings", label: "Configurações", icon: <Settings /> },
  ];

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <aside
      className={cn(
        "h-full bg-background border-r hidden md:flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={cn(
          "p-4 flex items-center justify-between",
          isCollapsed && "justify-center"
        )}
      >
        {!isCollapsed && (
          <h2 className="text-xl font-bold transition-opacity">OneBoard</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-muted transition"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            href={route.href}
            label={route.label}
            icon={route.icon}
            isActive={pathname === route.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Card do usuário */}
      <div
        onClick={handleProfileClick}
        className={cn(
          "m-4 p-3 rounded-xl cursor-pointer hover:bg-muted transition flex items-center gap-3",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        {user.picture && (
          <Image
            src={user.picture}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        {!isCollapsed && user.name && (
          <span className="text-sm font-medium truncate">{user.name}</span>
        )}
      </div>
    </aside>
  );
};

const SidebarItem = ({
  href,
  label,
  icon,
  isActive,
  isCollapsed,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
}) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 p-2 rounded-md transition cursor-pointer",
          isActive ? "bg-muted text-muted-foreground font-semibold" : "hover:bg-muted",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Link>
  );
};
