import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const GuardedRoute = ({ component: Component, canAccess, ...rest }) => (
    <Route {...rest} render={props => (canAccess ? <Component {...props} /> : <Redirect to="/" />)} />
);

export default GuardedRoute;
