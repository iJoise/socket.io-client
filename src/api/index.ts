import { io, Socket } from 'socket.io-client';
import { Message, SendMessage, User } from '../store/chat-reducer/types';

export const api = {
  socket: null as null | Socket,

  createConnection() {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });
  },

  subscribe(
    initMessagesCb: (messages: Message[]) => void,
    newMessageSentCb: (message: Message) => void,
    userTypingCb: (user: string) => void,
  ) {
    this.socket?.on('init-messages-published', initMessagesCb);
    this.socket?.on('new-message-sent', newMessageSentCb);
    this.socket?.on('user-typing', userTypingCb);
  },

  sendMessage(newMessage: SendMessage) {
    this.socket?.emit('client-message-sent', newMessage);
  },

  typeMessage(name: string) {
    this.socket?.emit('client-typed', name)
  },

  destroyConnection() {
    this.socket?.disconnect();
    this.socket = null;
  },
};
