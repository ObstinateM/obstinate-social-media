// React & Axios
import React, { useRef, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from 'Context/UserContext';

// CSS
import './Auth.css';

export function Login() {
    const [error, setError] = useState(null);
    const email = useRef(null);
    const password = useRef(null);
    const { setIsLoggedIn, setUser } = useContext(UserContext);
    let history = useHistory();

    const handleSubmit = () => {
        setError(null);
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_APIHOST}/api/auth/login`,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            data: JSON.stringify({
                email: email.current.value,
                password: password.current.value
            })
        })
            .then(res => {
                if (res.status === 202) {
                    console.log(res.data);
                    setUser(res.data);
                    setIsLoggedIn(true);
                    history.push('/');
                } else {
                    console.log(res);
                    setError('Server error, please try again');
                    toast.error('Cannot login!');
                }
            })
            .catch(err => {
                console.log(err);
                setError('An error has occured.');
                toast.error('Cannot login!');
            });
    };

    return (
        <div className="login">
            <div className="login-box">
                <h1>Login</h1>
                <h3>You need to login in order to access the website.</h3>
                <div className="input">
                    {error && <p className="login-error">Error: {error}</p>}
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Johndoe@example.com" name="email" ref={email} />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="*********" ref={password} />
                    <button onClick={handleSubmit} type="submit">
                        Submit
                    </button>
                    <a href="#" onClick={() => toast('Not implemented!', { icon: '⚠️' })}>
                        Forgot password ?
                    </a>
                    <Link to="/register">No account?</Link>
                </div>
            </div>
        </div>
    );
}
