import React, { RefObject, useEffect, useRef, useState } from 'react';
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
  const messagesAnchorRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [autoScrollIsActive, setAutoScrollIsActive] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [newMessage, setNewMessage] = useState({
    mess: 'hello',
    name: 'Kirill'
  });

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    socketRef.current?.on('init-messages-published', (messages) => {
      setMessages(messages)
    })

    socketRef.current?.on('new-message-sent', message => {
      setMessages((messages) => [...messages, message])
    })
  }, []);

  useEffect(() => {
    if (messagesAnchorRef.current && autoScrollIsActive) {
      messagesAnchorRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [messages])

  return (
    <div className="App">
      <div className={'chat'} onScroll={e => {
        const element = e.currentTarget
        const maxScrollPosition = element.scrollHeight - element.clientHeight;

        const module = Math.abs(maxScrollPosition - element.scrollTop)

        if (element.scrollTop > lastScrollTop && module < 10) {
          setAutoScrollIsActive(true)
        } else {
          setAutoScrollIsActive(false)
        }

        setLastScrollTop(element.scrollTop)
      }}>
        {messages &&
          messages.map(m => (
            <div key={m.id}>
              <b>{m.user.name}: </b>
              {m.message}
              <hr />
            </div>
          ))}
        <div ref={messagesAnchorRef}/>
      </div>
      <span>enter your name</span>
      <input
        type="text"
        value={newMessage.name}
        onChange={e => setNewMessage({...newMessage, name: e.currentTarget.value})}
      />
      <textarea
        name="chat"
        id="chat"
        cols={35}
        rows={5}
        disabled={!newMessage.name}
        value={newMessage.mess}
        onChange={e => setNewMessage({ ...newMessage, mess: e.currentTarget.value })}
      />
      <button
        disabled={!newMessage.name || !newMessage.mess}
        onClick={() => {
          socketRef.current?.emit('client-message-sent', newMessage);
          setNewMessage({ ...newMessage, mess: '' });
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
