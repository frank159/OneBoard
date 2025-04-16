import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { QuoteWidget } from "@/components/widgets/QuoteWidget";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-muted text-muted-foreground">
      <Sidebar />
      <main className="flex flex-col flex-1 p-6 space-y-6 overflow-auto">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <WeatherWidget />
          <QuoteWidget />
          {/* outros widgets aqui */}
        </div>
      </main>
    </div>
  );
}
