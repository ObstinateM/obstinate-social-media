// React & Axios
import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// CSS
import './Auth.css';

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
            url: `${process.env.REACT_APP_APIHOST}/api/auth/register`,
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
                    <a href="#" onClick={() => toast('Not implemented!', { icon: '⚠️' })}>
                        Forgot password ?
                    </a>
                    <Link to="/login">Already an account?</Link>
                </div>
            </div>
        </div>
    );
}
