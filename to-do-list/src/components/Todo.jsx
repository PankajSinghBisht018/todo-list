import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const Todo = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [addingTask, setAddingTask] = useState(false);

  const toggleCompleted = () => setShowCompleted(!showCompleted);
  const handleChange = (e) => setTodo(e.target.value);

  const handleAdd = () => {
    if (todo.trim() !== '') {
      setAddingTask(true);
      setTimeout(() => {
        setTodos([...todos, { id: Date.now(), todo, completed: false }]);
        setTodo('');
        setAddingTask(false);
      }, 1000);
    }
  };

  const handleDelete = (id) =>
     setTodos(todos.filter((item) => item.id !== id));

  const handleEdit = (id, text) => {
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const handleUpdate = (id) => {
    setTodos(
      todos.map((item) => (item.id === id ? { ...item, todo: editTodoText } : item))
    );
    setEditTodoId(null);
    setEditTodoText('');
  };

  const handleComplete = (id) => {
    setTodos(
      todos.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <>
      <Navbar toggleCompleted={toggleCompleted} />
      <div className='container mx-auto my-5 rounded-xl p-5 bg-pink-200 min-h-80'>
        <div className='shadow-xl bg-pink-100 ' >
          <h2 className='text-lg font-bold ml-4'>Add Task</h2>
          <input type="text" className='w-1/2 mx-4' onChange={handleChange} value={todo} />

          <button className='text-white bg-pink-800 rounded-xl py-2 px-3 mx-2 mb-4' onClick={handleAdd}>
            {addingTask ? <FontAwesomeIcon icon={faSpinner} spin /> : <><FontAwesomeIcon icon={faPlus} /> Add</>}
          </button>
        </div>
        <br />
        <h2 className='text-black font-bold text-lg ml-3'>Tasks</h2>
        <div className='shadow-xl bg-pink-100 py-4 px-4  hover:border-2 border-rose-600'>
          {todos.map((item) => (
            (!showCompleted || item.completed) &&
            <div key={item.id} className={`todoItem flex items-center justify-between mb-2 ${item.completed ? 'line-through' : ''}`}>
              <div>
                <input type="checkbox" checked={item.completed} onChange={() => handleComplete(item.id)} />
                <span className="ml-2">{item.todo}</span>
              </div>
              {editTodoId === item.id ? (
                <>
                  <input type="text" value={editTodoText} onChange={(e) => setEditTodoText(e.target.value)} />
                  <button className='text-white bg-pink-800 rounded-xl py-2 px-3 mx-1' onClick={() => handleUpdate(item.id)}>
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
