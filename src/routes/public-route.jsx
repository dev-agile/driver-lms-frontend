import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isUserAuthenticated } from "../guards/auth-guard";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isUserAuthenticated() ? (
          rest?.redirectRoute?.length ? (
            <Redirect
              to={{
                pathname: rest.redirectRoute,
                extras: { ...rest.location },
              }}
            />
          ) : (
            <Redirect to="/" />
          )
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
