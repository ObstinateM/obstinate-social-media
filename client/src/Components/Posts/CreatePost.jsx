import { useRef, useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './CreatePosts.css';
import { UserContext } from 'App';

export const CreatePost = ({ isShowing, toggle }) => {
    const content = useRef(null);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);
    let history = useHistory();

    const handleSubmit = event => {
        console.log(content.current.value);
        event.preventDefault();
        axios({
            method: 'POST',
            url: 'http://localhost:3001/api/private/posts/createpost/',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
            data: JSON.stringify({
                content: content.current.value
            })
        })
            .then(res => {
                console.log('PASSING THEN', res.status);
                if (res.status === 201) {
                    console.log('Created', res.data.message);
                    history.push('/');
                }
            })
            .catch(err => {
                console.log(err);
                setError('An error has occured. Please retry.');
            });
    };

    if (!isShowing) return null;

    return createPortal(
        <div className="bg">
            <div className="modal">
                <div className="input_post">
                    <button className="close-button" onClick={toggle}>
                        <img src="http://localhost:3000/images/cancel.png" alt="Close" />
                    </button>
                    <form onSubmit={handleSubmit}>
                        <h1>Create a post</h1>
                        {error ? <h3 className="error">ERROR : {error}</h3> : null}
                        <textarea ref={content} name="content" placeholder="Write your post text here..."></textarea>
                        <input type="file" name="" id="" />
                        <button className="submit-button" type="submit">
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};
