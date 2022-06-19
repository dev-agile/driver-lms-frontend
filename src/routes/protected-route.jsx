import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isUserAuthenticated } from "../guards/auth-guard";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  console.log('within ProtectedRoute')
  return (
    <Route
      {...rest}
      render={(props) =>
        isUserAuthenticated() === true ? (
          <Component {...props} />
        ) : rest?.redirectRoute?.length ?  (
          <Redirect
            to={{ pathname: rest.redirectRoute, extras: { ...rest.location } }}
          />
        ) : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;
