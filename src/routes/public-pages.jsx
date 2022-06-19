import React from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { LoginPage } from ".";
import initialLoading from "../pages/initial-loading";
import PublicRoute from "./public-route";

const PublicPages = (props) => {
  
    return (
      <div className="app">
        <div className="app-body">
          <main className="main">
            <Switch>
              <PublicRoute
                exact
                path="/initial"
                component={initialLoading}
                redirectRoute="/dashboard"
              />
               <PublicRoute
                exact
                path="/login"
                component={LoginPage}
                redirectRoute="/dashboard"
              />

              <Route
                exact
                path="*"
                render={() => <Redirect to="/login" />}
              />
            </Switch>
          </main>
        </div>
      </div>
    );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicPages);
