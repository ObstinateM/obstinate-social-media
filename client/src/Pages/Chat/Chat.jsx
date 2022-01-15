// React
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ChatBox } from '../../Components/ChatBox/ChatBox';
import { ChatNav } from '../../Components/ChatNav/ChatNav';
import './Chat.css';
import { UserContext } from 'Context/UserContext';
import socketIOClient from 'socket.io-client';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../Hook/useModal';
import axios from 'axios';
const ENDPOINT = 'http://127.0.0.1:3001';
const socket = socketIOClient(ENDPOINT);

export function ChatPage() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [userList, setUserList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [actualRoom, setActualRoom] = useState([]);
    const [rooms, setRooms] = useState([]);
    const { isShowing, toggle } = useModal();
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    let history = useHistory();

    // Join first room / or room with id
    useEffect(() => {
        socket.emit('getRooms', { accessToken: user.accessToken });
        socket.emit('room-join', { accessToken: user.accessToken, roomId: id });

        // Setting up event listeners
        socket.on('error', error => toast.error(error));
        socket.on('getRooms', rooms => setRooms(rooms));
        socket.on('room-join', room => {
            setActualRoom(room);
            socket.emit('getAllMessages', { accessToken: user.accessToken, roomId: room });
            socket.emit('userList', { accessToken: user.accessToken, roomId: room });
        });
        socket.on('getAllMessages', messages => setMessages(messages));
        socket.on('userList', userList => setUserList(userList));
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });

        // Fetching all users for room creation
        axios
            .get('http://localhost:3001/api/public/user/getall')
            .then(res => {
                setAllUsers(res['data'].filter(_user => _user.name !== user.name));
            })
            .catch(err => console.log(err));

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line
    }, []);

    const onChangeHandler = event => {
        const selectedOptions = event.currentTarget.selectedOptions;

        const newColors = [];
        for (let i = 0; i < selectedOptions.length; i++) {
            newColors.push(selectedOptions[i].value);
        }

        setSelectedUsers(newColors);
    };

    const onSubmit = e => {
        e.preventDefault();
        axios
            .post(
                'http://localhost:3001/api/private/chat/create',
                {
                    users: selectedUsers
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + user.accessToken
                    }
                }
            )
            .then(res => {
                console.log(res);
                history.push('/chat/' + res.data.roomId);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <>
            {isShowing ? (
                <div className="createroom">
                    <form className="createroom-form" onSubmit={onSubmit}>
                        <h2>Select the people</h2>
                        <select multiple onChange={onChangeHandler}>
                            {allUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="createroom-button">
                            Create Room
                        </button>
                        <button type="button" className="createroom-button" onClick={toggle}>
                            Close
                        </button>
                    </form>
                </div>
            ) : (
                <div className="line">
                    <ChatNav rooms={rooms} createRoom={toggle} />
                    <ChatBox roomId={actualRoom} messages={messages} userList={userList} socket={socket} />
                </div>
            )}
        </>
    );
}
