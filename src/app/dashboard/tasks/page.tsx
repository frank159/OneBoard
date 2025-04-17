"use client";

import React, { useState, useRef } from "react";
import { addTask, deleteTask, toggleTask, Task } from "./taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Trash } from "@phosphor-icons/react";

import { AppDispatch, RootState } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const categories = [
  { name: "Trabalho", icon: "💼" },
  { name: "Estudos", icon: "📚" },
  { name: "Saúde", icon: "🏋️" },
  { name: "Organização", icon: "🗂️" },
  { name: "Financeiro", icon: "💰" },
  { name: "Pessoal", icon: "👤" },
  { name: "Diversão", icon: "🎮" },
];

export default function TasksPage() {
  const [form, setForm] = useState<Task>({
    id: "",
    title: "",
    description: "",
    category: "",
    color: "#ffffff",
    completed: false,
    dueDate: "",
    startTime: "", // Adiciona o campo de hora de início
    endTime: "", // Adiciona o campo de hora de término
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [expandedTask, setExpandedTask] = useState<string | null>(null); // Estado para controlar o texto expandido
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const tasks = useAppSelector((state) => state.task.tasks) as Task[];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim()) return;

    // Validação: Hora de início deve ser menor que a hora de término
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      alert("A hora de início deve ser menor que a hora de término.");
      return;
    }

    dispatch(
      addTask({
        title: form.title,
        description: form.description,
        category: form.category,
        color: form.color,
        dueDate: form.dueDate,
        startTime: form.startTime,
        endTime: form.endTime,
      })
    );

    setForm({
      id: "",
      title: "",
      description: "",
      category: "",
      color: "#ffffff",
      completed: false,
      dueDate: "",
      startTime: "",
      endTime: "",
    });
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleCloseModal();
    }
  };

  const handleExpandText = (taskId: string) => {
    setExpandedTask(taskId); // Define a tarefa que será expandida
  };

  const handleCloseExpandedText = () => {
    setExpandedTask(null); // Fecha o modal de texto expandido
  };

  return (
    <div className="min-h-screen bg-transparent text-muted-foreground p-8">
      <h2 className="text-2xl font-bold mb-6">Minhas Tarefas</h2>
      {/* Botão para abrir o modal */}
      <button
        ref={buttonRef}
        onClick={handleOpenModal}
        className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:bg-primary/90"
      >
        Nova Tarefa
      </button>
      {/* Modal */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 cursor-pointer"
                onClick={handleBackdropClick}
              >
                <motion.div
                  ref={modalRef}
                  initial={{
                    top: modalPosition.top,
                    left: modalPosition.left,
                    width: modalPosition.width,
                    height: modalPosition.height,
                    opacity: 0,
                  }}
                  animate={{
                    top: "50%",
                    left: "50%",
                    width: "100%",
                    maxWidth: "400px",
                    height: "auto",
                    opacity: 1,
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.3 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="fixed z-50 bg-card text-card-foreground p-6 rounded-lg shadow-xl overflow-hidden border border-gray-300 dark:border-black"
                >
                  <h3 className="text-xl font-bold mb-4">Nova Tarefa</h3>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Título"
                      value={form.title}
                      onChange={handleChange}
                      className="border border-input bg-input text-input-foreground p-3 rounded-md"
                    />
                    <textarea
                      name="description"
                      placeholder="Descrição"
                      rows={3}
                      value={form.description}
                      onChange={handleChange}
                      className="border border-input bg-input text-input-foreground p-3 rounded-md resize-none"
                    />
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="border border-input bg-input text-input-foreground p-3 rounded-md"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-4">
                      <label htmlFor="color" className="font-semibold">
                        Cor:
                      </label>
                      <input
                        type="color"
                        id="color"
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        className="w-10 h-10 border border-input rounded-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="dueDate" className="font-semibold">
                        Data Limite:
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        className="border border-input bg-input text-input-foreground p-3 rounded-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="startTime" className="font-semibold">
                        Hora de Início:
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={form.startTime}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setForm({ ...form, [name]: value });

                          // Atualiza o valor mínimo do campo endTime
                          if (name === "startTime") {
                            setForm((prevForm) => ({
                              ...prevForm,
                              endTime:
                                prevForm.endTime && prevForm.endTime < value
                                  ? ""
                                  : prevForm.endTime,
                            }));
                          }
                        }}
                        className="border border-input bg-input text-input-foreground p-3 rounded-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="endTime" className="font-semibold">
                        Hora de Término:
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        disabled={!form.startTime} // Desabilita se startTime não tiver valor
                        min={form.startTime || undefined} // Define o valor mínimo com base no startTime
                        className={`border border-input bg-input text-input-foreground p-3 rounded-md ${
                          !form.startTime ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/90"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
                      >
                        Criar
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      {/* Lista de tarefas */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full">
        {tasks.map((task) => {
          const isOverdue =
            task.dueDate &&
            !task.completed &&
            new Date(task.dueDate) < new Date();

          // Calcula a duração da tarefa
          const calculateDuration = (startTime: string, endTime: string) => {
            if (!startTime || !endTime) return null;
            const [startHours, startMinutes] = startTime.split(":").map(Number);
            const [endHours, endMinutes] = endTime.split(":").map(Number);

            const start = startHours * 60 + startMinutes;
            const end = endHours * 60 + endMinutes;

            const duration = end - start;
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;

            return `${hours > 0 ? `${hours}h` : ""} ${
              minutes > 0 ? `${minutes}min` : ""
            }`.trim();
          };

          const duration = calculateDuration(
            task.startTime || "",
            task.endTime || ""
          );

          return (
            <li
              key={task.id}
              className={`relative h-64 bg-card border border-border rounded-md p-4 grid grid-cols-[1fr_15fr] gap-4 transition-transform duration-300 hover:scale-101 ${
                task.completed ? "opacity-50 line-through" : ""
              } ${isOverdue ? "bg-yellow-100 text-black" : ""}`} // Adiciona text-black se estiver em alerta
              style={{ borderLeft: `8px solid ${task.color}` }}
              onClick={() => handleExpandText(task.id)} // Abre o modal ao clicar no card
            >
              {/* Linha divisória central */}
              <div
                className={`absolute top-4 bottom-4 left-[10%] w-px ${
                  isOverdue ? "bg-red-200" : "bg-border"
                }`}
              ></div>

              {/* Coluna 1: Checkbox e botão de deletar */}
              <div className="flex flex-col items-center justify-between gap-4">
                <label className="flex flex-col items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      dispatch(toggleTask(task.id));
                    }}
                    className="w-8 h-8 cursor-pointer" // Tamanho uniforme
                  />
                </label>
                <Trash
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteTask(task.id));
                  }}
                  className="cursor-pointer text-3xl hover:text-red-500 transition-transform duration-300 hover:scale-110"
                  style={{ width: "32px", height: "32px" }} // Tamanho uniforme
                />
              </div>

              {/* Coluna 2: Conteúdo da tarefa */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center content-center gap-2 mb-2">
                    <p className="text-2xl font-semibold flex items-center gap-2">
                      {
                        categories.find((cat) => cat.name === task.category)
                          ?.icon
                      }
                    </p>
                    <h3 className="font-semibold flex items-center gap-2">
                      {task.title}
                    </h3>
                  </div>
                  <div className="relative text-sm mt-4 h-full max-h-24 overflow-hidden">
                    <p className="break-words">{task.description}</p>
                    <span
                      className={`
                        absolute bottom-0 left-0 w-full h-8
                        bg-gradient-to-t
                        ${isOverdue ? "from-yellow-100" : "from-card"}
                        to-transparent
                        pointer-events-none
                      `}
                    ></span>
                  </div>
                </div>
                <div>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500">
                      Data Limite: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {task.startTime && task.endTime && (
                    <p className="text-xs text-gray-500">
                      Horário: {task.startTime} - {task.endTime}{" "}
                      {duration && <span>({duration})</span>}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal para exibir o texto completo */}
      {expandedTask && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={handleCloseExpandedText}
        >
          <div
            className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-3xl w-auto"
            onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar no modal
            style={{
              maxWidth: "90%", // Limita a largura máxima a 90% da tela
              width: "auto", // Ajusta a largura ao conteúdo
            }}
          >
            <h3 className="text-xl font-bold mb-4">Descrição Completa</h3>
            <p className="text-sm break-words">
              {tasks.find((t) => t.id === expandedTask)?.description}
            </p>
            <button
              onClick={handleCloseExpandedText}
              className="mt-4 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
