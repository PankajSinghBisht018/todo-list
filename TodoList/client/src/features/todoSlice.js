import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodosAPI, addTodoAPI, deleteTodoAPI, updateTodoAPI, completeTodoAPI } from '../services/todoAPI';

const initialState = {
    todos: [],
    status: 'idle',
    error: null
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await fetchTodosAPI();
    return response.data;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo) => {
    const response = await addTodoAPI(newTodo);
    return response.data;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
    await deleteTodoAPI(id);
    return id;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async (todo) => {
    const response = await updateTodoAPI(todo);
    return response.data;
});

export const completeTodo = createAsyncThunk('todos/completeTodo', async (id) => {
    const response = await completeTodoAPI(id);
    return response.data;
});

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.todos = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.todos.push(action.payload);
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter(todo => todo._id !== action.payload);
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                const index = state.todos.findIndex(todo => todo._id === action.payload._id);
                if (index !== -1) {
                    state.todos[index] = action.payload;
                }
            })
            .addCase(completeTodo.fulfilled, (state, action) => {
                const index = state.todos.findIndex(todo => todo._id === action.payload._id);
                if (index !== -1) {
                    state.todos[index] = action.payload;
                }
            });
    }
});

export default todoSlice.reducer;
