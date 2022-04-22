import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { io, Socket } from 'socket.io-client';

type Messages = {
  message: string
  id: string
  user: {
    id: string
    name: string
  }
}

function App() {
  const socketRef = useRef<Socket>();
  const [messages, setMessages] = useState<Messages[] | null>(null);
  const [mess, setMess] = useState('hello');

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    socketRef.current?.on('init-messages-published', (messages) => {
      setMessages(messages)
    })
  }, []);

  return (
    <div className="App">
      <div className={'chat'}>
        {messages && messages.map(m => (
          <div key={m.id}>
            <b>{m.user.name}: </b>
            {m.message}
            <hr />
          </div>
        ))}
      </div>
      <textarea
        name="chat"
        id="chat"
        cols={35}
        rows={5}
        value={mess}
        onChange={e => setMess(e.currentTarget.value)}
      />
      <button
        onClick={() => {
          socketRef.current?.emit('client-message-sent', mess);
          setMess('')
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
