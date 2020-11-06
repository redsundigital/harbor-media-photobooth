import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'components';
import * as serviceWorker from './utils/serviceWorker';
import './index.css';

const root = document.getElementById('root');

ReactDOM.render(<App />, root);

// Hot-reload fix
// const appComponentPath = './components/App';
// if (
//   module.hot.accept(appComponentPath, () => {
//     const ReloadedApp = require(appComponentPath).default;
//     ReactDOM.render(<ReloadedApp />, root);
//   })
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
