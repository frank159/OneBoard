"use client"; // Adicione esta linha no início do arquivo

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Provider } from "react-redux";
import { store } from "./store"; // Ajuste o caminho conforme sua estrutura

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-muted text-muted-foreground">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 space-y-6">
        <Provider store={store}>
          {children}
        </Provider>
        </main>
      </div>
    </div>
  );
}
