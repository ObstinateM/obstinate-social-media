// React & Axios
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from 'Context/UserContext';

// CSS
import './Navbar.css';

export function Navbar() {
    const { user, setUser, setIsLoggedIn } = useContext(UserContext);

    const logout = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_APIHOST}/api/auth/logout`,
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

    return (
        <nav>
            <NavTitle icon="http://localhost:3000/images/work-in-progress.png" title="Twitter V2" />
            <UserInfo picture={user.avatar} name={user.name} />
            <NavSection sectionName="MAIN NAVIGATION">
                <NavItem icon="http://localhost:3000/images/home.png" title="Home" href="/" />
                <NavItem icon="http://localhost:3000/images/conversation.png" title="Chat" href="/chat" />
                <NavItem icon="http://localhost:3000/images/user.png" title="Profil" href={`/profil/${user.id}`} />
                <NavItem icon="http://localhost:3000/images/settings.png" title="Settings" href="/admin" />
                <NavItem icon="http://localhost:3000/images/logout.png" title="Logout" click={logout} />
            </NavSection>
        </nav>
    );
}

function NavTitle({ icon, title }) {
    return (
        <div className="title">
            <img src={icon} alt="WIP Logo" />
            <h1>{title}</h1>
        </div>
    );
}

function UserInfo({ picture, name }) {
    return (
        <>
            <div className="user-info">
                <img src={picture} alt="User avatar" className="avatar" />
                <p>{name}</p>
            </div>
        </>
    );
}

function NavSection({ sectionName, children }) {
    return (
        <div className="nav-link">
            <div className="nav-title">
                <p>{sectionName}</p>
            </div>
            {children}
        </div>
    );
}

function NavItem({ icon, alt, title, href = '#', click = null }) {
    const { pathname } = useLocation();

    return (
        <div className={pathname === href ? 'nav-item nav-active' : 'nav-item'}>
            <img src={icon} alt={alt} />
            <Link className={pathname === href ? 'nav-active' : ''} to={href} onClick={click}>
                {title}
            </Link>
        </div>
    );
}
