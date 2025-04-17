import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  color: string;
  dueDate?: string; // Data limite
  startTime?: string; // Hora de início
  endTime?: string; // Hora de término
}

// Função para carregar tarefas do localStorage
const loadTasksFromLocalStorage = (): Task[] => {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
};

// Função para salvar tarefas no localStorage
const saveTasksToLocalStorage = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const initialState: { tasks: Task[] } = {
  tasks: loadTasksFromLocalStorage(), // Carrega as tarefas do localStorage
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        category: string;
        color: string;
        dueDate?: string;
        startTime?: string; // Inclui a hora de início
        endTime?: string; // Inclui a hora de término
      }>
    ) => {
      const newTask = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        category: action.payload.category,
        color: action.payload.color,
        completed: false,
        dueDate: action.payload.dueDate,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
      };
      state.tasks.push(newTask);
      saveTasksToLocalStorage(state.tasks); // Salva no localStorage
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksToLocalStorage(state.tasks); // Salva no localStorage
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasksToLocalStorage(state.tasks); // Salva no localStorage
    },
  },
});

export const { addTask, toggleTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;