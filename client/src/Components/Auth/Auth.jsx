import React, { useRef, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Auth.css';
import { UserContext } from 'App';

export function Register() {
    const [error, setError] = useState(null);
    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const password2 = useRef(null);
    let history = useHistory();

    const handleSubmit = async () => {
        setError(null);
        axios({
            method: 'POST',
            url: 'http://localhost:3001/api/auth/register',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                name: name.current.value,
                email: email.current.value,
                password: password.current.value,
                password2: password2.current.value
            })
        })
            .then(res => {
                console.log(res);
                if (res.status === 201) {
                    history.push('/login');
                } else {
                    console.log(res.data);
                    setError(res.data);
                    toast.error('Cannot create account!');
                }
            })
            .catch(err => {
                setError(err.response.data.message);
                toast.error('Cannot create account!');
            });
    };

    return (
        <div className="login">
            <div class="login-box">
                <h1>Register</h1>
                <h3>You need to register in order to access the website.</h3>
                <div class="input">
                    {error && <p class="login-error">Error: {error}</p>}
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Johndoe@example.com" name="email" ref={email} />
                    <label htmlFor="name">Username</label>
                    <input type="text" placeholder="John Doe" name="name" ref={name} />
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="*********" ref={password} />
                    <label htmlFor="password2">Confirm Password</label>
                    <input type="password" name="password2" id="password2" placeholder="*********" ref={password2} />
                    <button onClick={handleSubmit}>Submit</button>
                    <Link to="/">Forgot password ?</Link>
                    <Link to="/login">Already an account?</Link>
                </div>
            </div>
        </div>
    );
}

export const Login = () => {
    const [error, setError] = useState(null);
    const email = useRef(null);
    const password = useRef(null);
    const { setIsLoggedIn, setUser } = useContext(UserContext);
    let history = useHistory();

    const handleSubmit = () => {
        setError(null);
        axios({
            method: 'POST',
            url: 'http://localhost:3001/api/auth/login',
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
                    <button onClick={handleSubmit}>Submit</button>
                    <Link to="/">Forgot password ?</Link>
                    <Link to="/register">No account?</Link>
                </div>
            </div>
        </div>
    );
};
