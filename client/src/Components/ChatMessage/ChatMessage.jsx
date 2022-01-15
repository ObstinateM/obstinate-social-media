import './ChatMessage.css';
import { useContext } from 'react';
import { UserContext } from 'Context/UserContext';

export function ChatMessage({ senderName, senderId, text, time }) {
    // Ici c'est juste l'ui des messages, avec la logique du MON message ou PAS
    const { user } = useContext(UserContext);

    if (user.id === senderId) {
        return (
            <div className="message mymessage">
                <span className="sender">{senderName}</span>
                <p className="text">{text}</p>
                <span className="time">{time}</span>
            </div>
        );
    }

    return (
        <div className="message othermessage">
            <span className="sender">{senderName}</span>
            <p className="text">{text}</p>
            <span className="time">{time}</span>
        </div>
    );
}
