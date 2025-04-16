import React, { useEffect, useState, useRef } from 'react';
import './Forum.css';

const Forum = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3002');

    wsRef.current.onopen = () => {
      console.log("Connected to chat server");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'history') {
          setMessages(data.payload);
        } else if (data.type === 'chatMessage') {
          setMessages(prev => [...prev, data.payload]);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      wsRef.current.close();
    };
  }, []);

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      wsRef.current.send(JSON.stringify({ content: inputValue }));
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="forum-container">
      <h2>Forum / Group Chat</h2>

      <div className="messages-container">
        {messages.map((m) => (
          <div key={m.id} className="message-item">
            <strong>User {m.user_id}:</strong> {m.content}
            <small className="message-timestamp">{m.created_at}</small>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          placeholder="Type a message..."
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Forum;
