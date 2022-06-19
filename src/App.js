import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createBrowserHistory } from "history";

import ProtectedPages from "./routes/protected-pages";
import PublicRoute from "./routes/public-route";
import publicPages from "./routes/public-pages";
import ProtectedRoute from "./routes/protected-route";
import CreateAccount from "./pages/create-account";
import RecipientList from "./pages/recipient-list";

export const history = createBrowserHistory();

function App() {
  // console.log = () => {};
  return (
    <Provider store={store}>
      <Router history={history}>
        <div>
          {/* <FullPageLoader></FullPageLoader> */}
          <ToastContainer
                position={"top-right"}
                hideProgressBar={false}
                newestOnTop={false}
                autoClose={3000}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
          <Suspense
            fallback={< div className="component-loader"><div className="loader-container">loading .......</div> </div>}>
            <Switch>
              <Route exact path="/recipient-list" component={RecipientList} />
              <Route exact path="/create-account" component={CreateAccount} />
              <PublicRoute 
              exact
                path="/login"
                component={publicPages}
                redirectRoute="/dashboard" />
              <ProtectedRoute
                exact
                path="*"
                component={ProtectedPages}
                redirectRoute="/login"
              />
              <Route component={<h1>404</h1>} />
            </Switch>
          </Suspense>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
