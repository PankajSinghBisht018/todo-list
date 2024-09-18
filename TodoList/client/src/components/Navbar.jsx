import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ShinyButton from '@/components/magicui/shiny-button';
import SparklesText from './magicui/sparkles-text';

const Navbar = ({ toggleCompleted, onLogout, showCompleted }) => {
    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
                 <SparklesText text="Todo App" className="text-2xl" sparklesCount={10} colors={{first: '#fbff00', second: '#FF5733'}}/>
                <div className="flex items-center space-x-4">
                    <ShinyButton
                        text={showCompleted ? 'Incomplete Tasks' : 'Completed Tasks'}
                        onClick={toggleCompleted}
                        className={`py-2 px-4 rounded-xl ${showCompleted ? 'bg-white text-black' : 'bg-yellow-500 text-black'}`}
                    />
                    <button
                        onClick={onLogout}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
