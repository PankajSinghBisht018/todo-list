import { combineReducers } from 'redux';
import todoReducer from './todoSlice';

const rootReducer = combineReducers({
  todos: todoReducer,
  
});

export default rootReducer;
