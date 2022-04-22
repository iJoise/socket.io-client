import { Message, SendMessage, State } from './types';
import { AppThunkType } from '../index';
import { api } from '../../api';

const initialState: State = {
  messages: [],
  newMessage: {
    name: '',
    message: '',
  },
  typingUsers: [],
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
        typingUsers: state.typingUsers.filter(u => u !== action.message.user.name),
      };
    case 'typing-user':
      return {
        ...state,
        typingUsers: [...state.typingUsers.filter(name => name !== action.name), action.name],
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
          message: action.message,
        },
      };
    default:
      return state;
  }
};

const messageReceived = (messages: Message[]) => ({ type: 'messages-received', messages } as const);
const newMessageReceived = (message: Message) =>
  ({ type: 'new-messages-received', message } as const);
export const updateName = (name: string) => ({ type: 'update-name', name } as const);
export const setNewMessage = (message: string) => ({ type: 'new-message', message } as const);
export const typingUserAdded = (name: string) => ({ type: 'typing-user', name } as const);

export const createConnection = (): AppThunkType => dispatch => {
  api.createConnection();
  api.subscribe(
    messages => {
      dispatch(messageReceived(messages));
    },
    message => {
      dispatch(newMessageReceived(message));
    },
    user => {
      dispatch(typingUserAdded(user));
    },
  );
};

export const sendNewMessage =
  (message: SendMessage): AppThunkType =>
  () => {
    api.sendMessage(message);
  };

export const typeMessage =
  (name: string): AppThunkType =>
  () => {
    api.typeMessage(name);
  };

export const destroyConnection = (): AppThunkType => () => {
  api.destroyConnection();
};

type MessageReceivedType = ReturnType<typeof messageReceived>;
type NewMessageReceivedType = ReturnType<typeof newMessageReceived>;
type UpdateName = ReturnType<typeof updateName>;
type SetNewMessage = ReturnType<typeof setNewMessage>;
type TypingUserAdded = ReturnType<typeof typingUserAdded>;

export type AllActionsType =
  | MessageReceivedType
  | NewMessageReceivedType
  | UpdateName
  | SetNewMessage
  | TypingUserAdded;
