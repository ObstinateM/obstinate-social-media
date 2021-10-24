import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export const Navbar = ({ children }) => {
    return <nav>{children}</nav>;
};

export const NavTitle = ({ icon, title }) => {
    return (
        <div className="title">
            <img src={icon} alt="WIP Logo" />
            <h1>{title}</h1>
        </div>
    );
};

export const UserInfo = ({ picture, name }) => {
    return (
        <>
            <div className="user-info">
                <img src={picture} alt="User avatar" className="avatar" />
                <p>{name}</p>
            </div>
        </>
    );
};

export const NavSection = ({ sectionName, children }) => {
    return (
        <div className="nav-link">
            <div className="nav-title">
                <p>{sectionName}</p>
            </div>
            {children}
        </div>
    );
};

export const NavItem = ({ icon, alt, title, href = '#', click = null }) => {
    const { pathname } = useLocation();

    return (
        <div className={pathname === href ? 'nav-item nav-active' : 'nav-item'}>
            <img src={icon} alt={alt} />
            <Link className={pathname === href ? 'nav-active' : ''} to={href} onClick={click}>
                {title}
            </Link>
        </div>
    );
};
