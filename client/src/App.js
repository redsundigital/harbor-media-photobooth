import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { SocketContext } from 'contexts';
import socket from 'utils/socket';
import { Home } from 'views';
import { Camera, Preview } from 'views/camera';
import { Remote } from 'views/remote';
import { StoreProvider } from 'store.js';

function App() {
  return (
    <Router>
      <StoreProvider>
        <SocketContext.Provider value={socket}>
          <Switch>
            <Route path="/camera/:pairId/preview" component={Preview} />
            <Route path="/camera" component={Camera} />
            <Route path="/remote" component={Remote} />
            <Route path="/" component={Home} />
          </Switch>
        </SocketContext.Provider>
      </StoreProvider>
    </Router>
  );
}

export default App;
