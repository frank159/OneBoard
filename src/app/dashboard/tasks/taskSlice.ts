// filepath: c:\Users\FRANK.FILHO\Documents\meuProjeto\OneBoard\src\features\taskSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  color: string; // Added color property
}

const initialState: { tasks: Task[] } = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<{ title: string; description: string; category: string; color: string }>
    ) => {
      state.tasks.push({
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        category: action.payload.category, // Define a categoria
        color: action.payload.color, // Define a cor
        completed: false,
      });
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
});

export const { addTask, toggleTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;