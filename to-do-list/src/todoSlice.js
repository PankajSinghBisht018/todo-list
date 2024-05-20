
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    
    updateTodo: (state, action) => {
      const { id, updatedTodo } = action.payload;
      const index = state.todos.findIndex(todo => todo.id === id);
      
      if (index !== -1) {
        state.todos[index] = updatedTodo;
      }
    },
  },
});

export const { addTodo, deleteTodo, editTodo, updateTodo } = todoSlice.actions;

export default todoSlice.reducer;
