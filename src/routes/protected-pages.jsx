import React from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { DashboardPage } from ".";
import ProtectedRoute from "./protected-route";

const ProtectedPages = (props) => {
  console.log("Inside the Protected Pages");
  return (
    <div className="app">
      <div className="app-body">
        <main className="main">
          <Switch>
            <ProtectedRoute
              exact
              path="/dashboard"
              component={DashboardPage}
              redirectRoute="/login"
            />

            <Route exact path="*" render={() => <Redirect to="/dashboard" />} />
          </Switch>
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedPages);
