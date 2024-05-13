import React from 'react';

const Navbar = ({ toggleCompleted }) => {
  return (
    <nav className='flex justify-between px-4 bg-pink-800 text-white py-4'>
      <div className='text-center font-bold text-xl'>Todo-List</div>
      <button className=' hover:animate-bounce text-white bg-pink-700 rounded-xl py-2 px-3 mx-2 shadow-lg' onClick={toggleCompleted}>
        Completed Task
      </button>
    </nav>
  );
};

export default Navbar;
