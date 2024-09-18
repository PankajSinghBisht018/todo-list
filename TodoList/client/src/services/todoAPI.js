import axios from 'axios';

const API_URL = 'http://localhost:5000/todos';

export const fetchTodosAPI = () => axios.get(API_URL);

export const addTodoAPI = (newTodo) => axios.post(API_URL, newTodo, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
});

export const deleteTodoAPI = (id) => axios.delete(`${API_URL}/${id}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});

export const updateTodoAPI = (todo) => axios.put(`${API_URL}/${todo._id}`, todo, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
});

export const completeTodoAPI = (id) => axios.put(`${API_URL}/${id}`, { completed: true }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
});
