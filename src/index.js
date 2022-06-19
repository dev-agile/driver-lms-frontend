import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-custom-flag-select/lib/react-custom-flag-select.min.css";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ContextWrapper from './context';

ReactDOM.render(
  <React.StrictMode>
    <ContextWrapper>
    <App />
    </ContextWrapper>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
