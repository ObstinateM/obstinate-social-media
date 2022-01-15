import './ChatNav.css';
import { useContext } from 'react';
import { UserContext } from 'Context/UserContext';

export function ChatNav({ rooms, createRoom }) {
    const { user } = useContext(UserContext);

    return (
        <>
            <aside className="chatnav">
                <h3 className="chatnav-header">Select someone to chat with</h3>
                <div className="room-container">
                    {rooms.map(room => (
                        <div key={room.room_id} className="chatnav-spacing">
                            <a href={'/chat/' + room.room_id}>
                                {room['name']
                                    .split(', ')
                                    .filter(name => name !== user.name)
                                    .join(' & ')}
                            </a>
                        </div>
                    ))}
                </div>
                <div className="chatnav-createroom">
                    <button className="chatnav-createbutton" onClick={createRoom}>
                        Create a new room
                    </button>
                </div>
            </aside>
        </>
    );
}
