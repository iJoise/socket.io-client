export interface User {
  id: string;
  name: string;
}

export interface Message {
  message: string;
  id: string;
  user: User;
}

export interface State {
  messages: Message[];
  newMessage: SendMessage
}

export interface SendMessage {
  name: string,
  message: string
}
