import React from 'react';
import { Route, useHistory } from 'react-router-dom';

function GuardedRoute({ component: Component, canAccess, ...rest }) {
    let history = useHistory();
    return <Route {...rest} render={props => (canAccess ? <Component {...props} /> : history.goBack())} />;
}

export default GuardedRoute;
