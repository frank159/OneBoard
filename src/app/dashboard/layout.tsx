// app/dashboard/layout.tsx

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-muted text-muted-foreground">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
