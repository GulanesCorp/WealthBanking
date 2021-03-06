import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useBankContext } from '../BankContext/BankAppContext';

function PrivateRoute({ component: Component, ...rest }) {
  const { authenticated } = useBankContext();

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );
}

export default PrivateRoute;
