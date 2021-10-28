import React, { useState, useMemo, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, NavTitle, UserInfo, NavItem, NavSection } from 'Components/Navbar/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import { Feed } from './Components/Posts/Posts';
import { Register, Login } from './Components/Auth/Auth';
import GuardedRoute from 'Components/GuaredRoute/GuaredRoute';
import './App.css';
import axios from 'axios';

export const UserContext = createContext({
    isLoggedIn: false,
    user: {}
});

export function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // TODO : Add isLoading state
    const value = useMemo(
        () => ({
            isLoading,
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser
        }),
        [isLoggedIn, user]
    );

    const logout = () => {
        axios({
            method: 'GET',
            url: 'http://localhost:3001/api/auth/logout',
            withCredentials: true
        })
            .then(res => {
                toast.success(res.data.message);
                setIsLoggedIn(false);
                setUser({});
            })
            .catch(_ => {
                toast.error('Please retry to logout.');
            });
    };

    const refreshToken = () => {
        axios({
            method: 'GET',
            url: 'http://localhost:3001/api/auth/refresh',
            withCredentials: true
        })
            .then(res => {
                if (res.status === 202) {
                    // Login + Redirect
                    console.log(res.data);
                    setIsLoggedIn(true);
                    setUser(res.data);
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
    };

    useEffect(() => {
        refreshToken();
    }, []);

    if (isLoading) return <h1>Loading...</h1>;
    if (!isLoggedIn)
        return (
            <UserContext.Provider value={value}>
                <Login />
            </UserContext.Provider>
        );

    return (
        <UserContext.Provider value={value}>
            <Toaster />
            <Router forceRefresh={true}>
                <Navbar>
                    <NavTitle icon="images/work-in-progress.png" title="Twitter V2" />
                    <UserInfo picture={user.avatar} name={user.name} />
                    <NavSection sectionName="MAIN NAVIGATION">
                        <NavItem icon="images/dashboard.png" title="Home" href="/" />
                        <NavItem icon="images/settings.png" title="Profil" href="/profil" />
                        <NavItem icon="images/settings.png" title="Settings" href="/admin" />
                        <NavItem icon="images/logout.png" title="Logout" click={logout} />
                    </NavSection>
                </Navbar>
                <main>
                    <Switch>
                        <Route path="/" exact component={Feed} />
                        <GuardedRoute path="/admin" canAccess={false} component={() => <h1>Admin</h1>} />
                        <Route path="/" component={() => <h1>404 Error</h1>} />
                    </Switch>
                </main>
            </Router>
        </UserContext.Provider>
    );
}
