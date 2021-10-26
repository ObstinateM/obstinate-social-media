import React, { useRef, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

    const resetForm = () => {
        name.current.value = '';
        email.current.value = '';
        password.current.value = '';
        password2.current.value = '';
    };

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
                    toast.success('Successfully created! You can now login.');
                    resetForm();
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
                    <label for="email">Email</label>
                    <input type="email" placeholder="Johndoe@example.com" name="email" ref={email} />
                    <label for="name">Username</label>
                    <input type="text" placeholder="John Doe" name="name" ref={name} />
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="*********" ref={password} />
                    <label for="password2">Confirm Password</label>
                    <input type="password" name="password2" id="password2" placeholder="*********" ref={password2} />
                    <button onClick={handleSubmit}>Submit</button>
                    <a href="#">Forgot password ?</a>
                    <a href="#">Already an account?</a>
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
                    // Login + Redirect
                    console.log(res.data);
                    setIsLoggedIn(true);
                    setUser(res.data);
                    setError('Now logged in, GG WP');
                    toast.success("You're now logged in");
                    console.log('GG WP');
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
            <div class="login-box">
                <h1>Login</h1>
                <h3>You need to login in order to access the website.</h3>
                <div class="input">
                    {error && <p class="login-error">Error: {error}</p>}
                    <label for="email">Email</label>
                    <input type="email" placeholder="Johndoe@example.com" name="email" ref={email} />
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="*********" ref={password} />
                    <button onClick={handleSubmit}>Submit</button>
                    <a href="#">Forgot password ?</a>
                    <a href="#">No account?</a>
                </div>
            </div>
        </div>
    );
};
