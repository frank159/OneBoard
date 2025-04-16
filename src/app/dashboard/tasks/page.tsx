"use client";

import React, { useState, useRef } from "react";
import { addTask, deleteTask, toggleTask, Task } from "./taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

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
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const tasks = useAppSelector((state) => state.task.tasks) as Task[];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim()) return;

    dispatch(
      addTask({
        title: form.title,
        description: form.description,
        category: form.category, // Envia a categoria selecionada
        color: form.color, // Envia a cor selecionada
      })
    );

    setForm({
      id: "",
      title: "",
      description: "",
      category: "",
      color: "#ffffff",
      completed: false,
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
      <ul className="space-y-4 mt-8">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`bg-card border border-border rounded-md p-4 flex justify-between items-start ${
              task.completed ? "opacity-50 line-through" : ""
            }`}
            style={{ borderLeft: `8px solid ${task.color}` }} // Usando a cor da tarefa
          >
            <div
              className="cursor-pointer flex-1"
              onClick={() => dispatch(toggleTask(task.id))}
            >
              <h3 className="font-semibold flex items-center gap-2">
                {categories.find((cat) => cat.name === task.category)?.icon}{" "}
                {task.title}
              </h3>
              <p className="text-sm">{task.description}</p>
            </div>
            <button
              className="ml-4 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm px-3 py-1 rounded"
              onClick={() => dispatch(deleteTask(task.id))}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
