import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import Todo from './components/Todo';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [showCompleted, setShowCompleted] = useState(false);
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTodos();
        }
    }, [isAuthenticated]);

    const getAuthToken = () => localStorage.getItem('token');

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const toggleCompleted = () => {
        setShowCompleted(prev => !prev);
    };

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/todos', {
                headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' }
            });
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos', error);
        }
    };

    return (
        <>
            <ToastContainer />
            <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/todos" /> : <Login onLogin={handleLogin} />} />
                <Route path="/todos" element={isAuthenticated ? (
                    <>
                        <Navbar toggleCompleted={toggleCompleted} onLogout={handleLogout} showCompleted={showCompleted} />
                        <Todo todos={todos} showCompleted={showCompleted} fetchTodos={fetchTodos} />
                    </>
                ) : (
                    <Navigate to="/login" />
                )} />
                <Route path="/" element={<Navigate to={isAuthenticated ? "/todos" : "/login"} />} />
                <Route path="/password-reset" element={<ForgotPassword />} />
                <Route path="/resetpassword/:token" element={<ResetPassword />} />
            </Routes>
        </>
    );
}

export default App;
