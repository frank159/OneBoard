"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import Head from "next/head";
import clsx from "clsx";

export default function CalendarView() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Se o tema for dark, aplicaremos a classe "dark-theme" na div principal
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <Head>
        {/* Incluindo os CSS do FullCalendar */}
        <link
          href="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.10/main.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.10/main.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fullcalendar/timegrid@6.1.10/main.min.css"
          rel="stylesheet"
        />
      </Head>
      {/* Aplique a classe dinâmica para o tema */}
      <div className={clsx("p-4 rounded-xl shadow-md", isDark && "dark-theme")}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale={ptBrLocale}
          editable={true}
          selectable={true}
          events={[
            {
              title: "Evento Exemplo",
              date: new Date().toISOString().split("T")[0],
            },
          ]}
          height="auto"
        />
      </div>
    </>
  );
}
