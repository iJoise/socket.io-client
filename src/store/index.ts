import { applyMiddleware, combineReducers, createStore } from 'redux';
import { AllActionsType, chatReducer } from './chat-reducer';
import thunk, { ThunkAction } from 'redux-thunk';

const rootReducer = combineReducers({
  chat: chatReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk))



export type RootState = ReturnType<typeof rootReducer>;
export type AppThunkType = ThunkAction<void, RootState, unknown, AllActionsType>
