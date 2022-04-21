// React & Axios
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

// Components
import { Toaster } from 'react-hot-toast';
import { Register } from 'Components/Auth/Register';
import { Login } from 'Components/Auth/Login';
import { Navbar } from 'Components/Navbar/Navbar';
import GuardedRoute from 'Components/GuaredRoute/GuaredRoute';

// Pages
import { HomePage } from 'Pages/Home/Home';
import { CommentPage } from 'Pages/Comment/Comment';
import { ProfilPage } from 'Pages/Profil/Profil';
import { ChatPage } from 'Pages/Chat/Chat';
import { SettingPage } from 'Pages/Setting/Setting';

// Context
import { UserContext } from 'Context/UserContext';

// CSS
import './App.css';

export function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const refreshToken = useCallback((force = false) => {
        axios({
            method: 'GET',
            url: force
                ? `${process.env.REACT_APP_APIHOST}/api/auth/refresh?force=true`
                : `${process.env.REACT_APP_APIHOST}/api/auth/refresh`,
            withCredentials: true
        })
            .then(res => {
                if (res.status === 202) {
                    setUser(res.data);
                    setIsLoggedIn(true);
                    setTimeout(() => {
                        refreshToken();
                    }, 15 * 60 * 1000 - 5000);
                } else {
                    console.log(res);
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        refreshToken();
    }, []);

    const value = useMemo(
        () => ({
            isLoading,
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            refreshToken
        }),
        [isLoading, isLoggedIn, user, refreshToken]
    );

    if (isLoading) return <h1>Loading...</h1>;
    if (!isLoggedIn)
        return (
            <UserContext.Provider value={value}>
                <Toaster position="top-right" />
                <Router forceRefresh={true}>
                    <Switch>
                        <Route path="/register" component={Register} />
                        <Route path="/" component={Login} />
                    </Switch>
                </Router>
            </UserContext.Provider>
        );

    return (
        <UserContext.Provider value={value}>
            <Toaster position="top-right" />
            <Router forceRefresh={true}>
                <Navbar />
                <main>
                    <Switch>
                        <Route path="/" exact component={HomePage} />
                        <Route path="/profil/:id" component={ProfilPage} />
                        <Route path="/post/:id" component={CommentPage} />
                        <Route path="/chat/:id" component={ChatPage} />
                        <Route path="/chat/" component={ChatPage} />
                        <Route path="/setting/" component={SettingPage} />
                        <GuardedRoute path="/admin" canAccess={false} component={() => <h1>Admin</h1>} />
                        <Route path="/" component={() => <h1>404 Error</h1>} />
                    </Switch>
                </main>
            </Router>
        </UserContext.Provider>
    );
}
