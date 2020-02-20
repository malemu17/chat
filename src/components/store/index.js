import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './authReducer';




const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//export default createStore(rootReducer, initialState,  composeEnhancers(applyMiddleware(thunk)));

const store = createStore(reducer, {}, composeEnhancers(applyMiddleware(thunk, logger)));
export default store;