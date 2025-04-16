import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./tasks/taskSlice";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    // outros reducers aqui
  },
});

// Inferindo os tipos da store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
