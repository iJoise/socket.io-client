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
  typingUsers: string[]
}

export interface SendMessage {
  name: string,
  message: string
}
