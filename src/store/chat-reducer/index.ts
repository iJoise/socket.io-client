import { Message, SendMessage, State } from './types';
import { AppThunkType } from '../index';
import { api } from '../../api';

const initialState: State = {
  messages: [],
  newMessage: {
    name: '',
    message: '',
  },
};

export const chatReducer = (state: State = initialState, action: AllActionsType): State => {
  switch (action.type) {
    case 'messages-received':
      return {
        ...state,
        messages: action.messages,
      };
    case 'new-messages-received':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case 'update-name':
      return {
        ...state,
        newMessage: {
          ...state.newMessage,
          name: action.name,
        },
      };
    case 'new-message':
      return {
        ...state,
        newMessage: {
          ...state.newMessage,
          message: action.message
        }
      }
    default:
      return state;
  }
};

const messageReceived = (messages: Message[]) => ({ type: 'messages-received', messages } as const);
const newMessageReceived = (message: Message) =>
  ({ type: 'new-messages-received', message } as const);
export const updateName = (name: string) => ({ type: 'update-name', name } as const);
export const setNewMessage = (message: string) => ({ type: 'new-message', message } as const);

export const createConnection = (): AppThunkType => dispatch => {
  api.createConnection();
  api.subscribe(
    messages => {
      dispatch(messageReceived(messages));
    },
    message => {
      dispatch(newMessageReceived(message));
    },
  );
};
export const sendNewMessage = (message: SendMessage): AppThunkType => dispatch => {
  api.sendMessage(message);
}

export const destroyConnection = (): AppThunkType => dispatch => {
  api.destroyConnection();
};

type MessageReceivedType = ReturnType<typeof messageReceived>;
type NewMessageReceivedType = ReturnType<typeof newMessageReceived>;
type UpdateName = ReturnType<typeof updateName>;
type SetNewMessage = ReturnType<typeof setNewMessage>;

export type AllActionsType = MessageReceivedType | NewMessageReceivedType | UpdateName | SetNewMessage;
