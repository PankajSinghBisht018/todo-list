import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import { addTodo, deleteTodo, updateTodo } from '../todoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Todo = () => {
  const [todo, setTodo] = useState('');
  const todos = useSelector(state => state.todos.todos);
  const dispatch = useDispatch();
  const [showCompleted, setShowCompleted] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);

  const toggleCompleted = () => setShowCompleted(!showCompleted);
  const handleChange = (e) => setTodo(e.target.value);

  const handleAdd = () => {
    if (todo.trim() !== '') {
      setAddingTask(true);
      dispatch(addTodo({ id: Date.now(), todo, completed: false }));
      setTodo('');
      setTimeout(() => {
        setAddingTask(false);
        toast.success("Task added successfully!", { position: "top-center" });
      }, 1000);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
    toast.error("Task deleted successfully!", { position: "top-center" });
  };

  const handleEdit = (id, text) => {
    setEditTodoId(id);
    setTodo(text);
  };

  const handleUpdate = (id, updatedText) => {
    const updatedTodo = todos.find(item => item.id === id);
    if (updatedText.trim() !== '') {
      dispatch(updateTodo({ id, updatedTodo: { ...updatedTodo, todo: updatedText } }));
      setEditTodoId(null);
      toast.success("Task updated successfully!", { position: "top-center" });
    } else {
      toast.error("Please enter a valid task!", { position: "top-center" });
    }
  };

  const handleComplete = (id) => {
    const todoToUpdate = todos.find(item => item.id === id);
    dispatch(updateTodo({
      id,
      updatedTodo: { ...todoToUpdate, completed: !todoToUpdate.completed }
    }));
  };

  return (
    <>
      <Navbar toggleCompleted={toggleCompleted} />
      <div className='container mx-auto my-5 rounded-xl p-5 bg-pink-200 min-h-80'>
        <ToastContainer position="top-center" />
        <div className='shadow-xl bg-pink-100 ' >
          <h2 className='text-lg font-bold ml-4'>Add Task</h2>
          <input type="text" className='w-1/2 mx-4' onChange={handleChange} value={todo} />
          <button className='text-white bg-pink-800 rounded-xl py-2 px-3 mx-2 mb-4' onClick={handleAdd}>
            {addingTask ? <FontAwesomeIcon icon={faSpinner} spin /> : <><FontAwesomeIcon icon={faPlus} /> Add</>}
          </button>
        </div>
        <br />
        <h2 className='text-black font-bold text-lg ml-3'>Tasks</h2>
        <div className='shadow-xl bg-pink-100 py-4 px-4 hover:border-2 border-rose-600'>
          {todos.map((item) => (
            (!showCompleted || item.completed) &&
            <div key={item.id} className='todoItem flex items-center justify-between mb-2'>
              <div>
                <input type="checkbox" checked={item.completed} onChange={() => handleComplete(item.id)} />
                <span className={`ml-2 ${item.completed ? 'line-through' : ''}`}>{item.todo}</span>
              </div>
              {editTodoId === item.id ? (
                <>
                  <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)} />
                  <button className='text-white bg-pink-800 rounded-xl py-2 px-3 mx-1' onClick={() => handleUpdate(item.id, todo)}>
                    <FontAwesomeIcon icon={faSave} /> Update
                  </button>
                </>
              ) : (
                <div>
                  <button className='text-white bg-pink-800 rounded-xl py-2 px-3 mx-1' onClick={() => handleDelete(item.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                  <button className='text-white bg-pink-800 rounded-xl py-2 px-3 mx-1' onClick={() => handleEdit(item.id, item.todo)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Todo;
