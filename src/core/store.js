import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';

const initialState = {};
const middleWare = [thunk];

const store = createStore(
    initialState,
    compose(
        applyMiddleware(...middleWare)
    )
);

export default store;