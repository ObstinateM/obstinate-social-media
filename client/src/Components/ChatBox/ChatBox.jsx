import React, { useContext, useRef } from 'react';
import './ChatBox.css';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { UserContext } from 'Context/UserContext';

export function ChatBox({ roomId, messages, userList, socket }) {
    // Faire une chatbox qui comprend la logique, les requests etc...
    const { user } = useContext(UserContext);
    const message = useRef(null);

    const sendMessage = e => {
        e.preventDefault();
        console.log(message.current.value);
        socket.emit('message', {
            accessToken: user.accessToken,
            roomId: roomId,
            content: message.current.value
        });
        message.current.value = '';
    };

    return (
        <div className="chatbox-container">
            <div className="chatbox-header">
                <h2>
                    {userList
                        .filter(({ name }) => name !== user.name)
                        .map(({ name }) => name)
                        .join(' & ')}
                </h2>
            </div>
            <div className="chatbox">
                {/* <div className="chatbox-header">
                <h2>Chatbox Title</h2>
            </div> */}
                <div className="chatmsg">
                    {messages.map(message => (
                        <ChatMessage
                            key={message.id}
                            senderName={message.name}
                            senderId={message.user_id}
                            text={message.content}
                            time={message.timestamp}
                        />
                    ))}
                </div>
            </div>
            <div>
                <form onSubmit={sendMessage} className="chat-form">
                    <input ref={message} type="text" className="chat-input" placeholder="Write your message here" />
                    <button className="chat-submit" type="submit">
                        <img src="http://localhost:3000/images/send.png" alt="Send" className="chat-submit-image" />
                    </button>
                </form>
            </div>
        </div>
    );
}
