"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Task } from "./taskSlice";
import { AppDispatch, RootState } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { useState, useMemo } from "react";

// Definição de categorias com ícones
const categories = [
  { name: "Trabalho", icon: "💼" },
  { name: "Estudos", icon: "📚" },
  { name: "Saúde", icon: "🏋️" },
  { name: "Organização", icon: "🗂️" },
  { name: "Financeiro", icon: "💰" },
  { name: "Pessoal", icon: "👤" },
  { name: "Diversão", icon: "🎮" },
];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Utilitário para calcular cor de texto contrastante
function getContrastColor(hexColor: string) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
}

export default function CalendarView() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const tasks = useAppSelector((state) => state.task.tasks);

  // Estado para a task selecionada no calendário
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Mapeia as tasks para eventos do FullCalendar
  const calendarEvents = useMemo(
    () =>
      tasks.map((task) => ({
        id: task.id,
        title: task.title,
        start: `${task.dueDate}T${task.startTime}`,
        end: task.endTime ? `${task.dueDate}T${task.endTime}` : undefined,
        backgroundColor: task.color,
        extendedProps: { task },
      })),
    [tasks]
  );

  return (
    <>
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
          editable={false}
          selectable={false}
          events={calendarEvents}
          eventContent={(arg) => {
            const task = arg.event.extendedProps.task as Task;
            const bg = arg.event.backgroundColor as string;
            const color = getContrastColor(bg);
            const isCompleted = task.completed;

            return (
              <div
                style={{
                  backgroundColor: bg,
                  color,
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                <b>{arg.timeText}</b>{" "}
                <span
                  style={{
                    textDecoration: isCompleted ? "line-through" : "none",
                  }}
                >
                  {arg.event.title}
                </span>
                <span
                  className="ml-2 text-green-900"
                  style={{
                    textShadow: `
                      -1px -1px 0 #fff,
                      1px -1px 0 #fff,
                      -1px  1px 0 #fff,
                      1px  1px 0 #fff
                    `,
                  }}
                >
                  ✓
                </span>
              </div>
            );
          }}
          eventClick={(info) => {
            const task = (info.event.extendedProps as any).task as Task;
            setSelectedTask(task);
          }}
          height="auto"
        />
      </div>

      {/* Modal de detalhes da tarefa */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-card text-card-foreground p-6 rounded-lg shadow-xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderLeft: `8px solid ${selectedTask.color}`,
              maxWidth: "90%",
              width: "auto",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">
                {categories.find((c) => c.name === selectedTask.category)?.icon}
              </span>
              <h3 className="text-xl font-bold">{selectedTask.title}</h3>
            </div>
            <p className="text-sm mb-4">{selectedTask.description}</p>
            {selectedTask.dueDate && (
              <p className="text-xs text-gray-500">
                Data Limite:{" "}
                {new Date(selectedTask.dueDate).toLocaleDateString()}
              </p>
            )}
            {selectedTask.startTime && selectedTask.endTime && (
              <p className="text-xs text-gray-500">
                Horário: {selectedTask.startTime} - {selectedTask.endTime}
              </p>
            )}
            <button
              onClick={() => setSelectedTask(null)}
              className="mt-6 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
