import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { useAppSelector } from './hook/useAppSelector';
import {
  createConnection,
  destroyConnection,
  sendNewMessage,
  setNewMessage,
  typeMessage,
  updateName,
} from './store/chat-reducer';
import { useDispatch } from 'react-redux';

function App() {
  const messagesAnchorRef = useRef<HTMLDivElement>(null);
  const [autoScrollIsActive, setAutoScrollIsActive] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { messages, newMessage, typingUsers } = useAppSelector(state => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createConnection());
    return () => {
      dispatch(destroyConnection());
    };
  }, [dispatch]);

  useEffect(() => {
    if (messagesAnchorRef.current && autoScrollIsActive) {
      messagesAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScrollIsActive]);

  return (
    <div className="App">
      <div
        className={'chat'}
        onScroll={e => {
          const element = e.currentTarget;
          const maxScrollPosition = element.scrollHeight - element.clientHeight;
          const module = Math.abs(maxScrollPosition - element.scrollTop);
          if (element.scrollTop > lastScrollTop && module < 10) {
            setAutoScrollIsActive(true);
          } else {
            setAutoScrollIsActive(false);
          }
          setLastScrollTop(element.scrollTop);
        }}
      >
        {messages &&
          messages.map(m => (
            <div key={m.id}>
              <b>{m.user.name}: </b>
              {m.message}
              <hr />
            </div>
          ))}
        <div ref={messagesAnchorRef} />
      </div>
      <div className={'typing'}>
        {typingUsers &&
          typingUsers.map(name => (
            <div key={name}>
              <b>{name}: </b>...🖌
            </div>
          ))}
      </div>
      <span>enter your name</span>
      <input
        type="text"
        value={newMessage.name}
        onChange={e => dispatch(updateName(e.currentTarget.value))}
      />
      <textarea
        name="chat"
        id="chat"
        cols={35}
        rows={5}
        disabled={!newMessage.name}
        value={newMessage.message}
        onChange={e => {
          dispatch(setNewMessage(e.currentTarget.value));
          dispatch(typeMessage(newMessage.name));
        }}
      />
      <button
        disabled={!newMessage.name || !newMessage.message}
        onClick={() => {
          dispatch(sendNewMessage(newMessage));
          dispatch(setNewMessage(''));
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
