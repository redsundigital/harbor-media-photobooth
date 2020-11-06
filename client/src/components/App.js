import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SocketContext } from 'contexts';
import { StoreProvider } from 'store.js';
import socket from 'utils/socket';

import { Home, Kiosk, Preview, Remote } from 'components';

function App() {
  return (
    <Router>
      <StoreProvider>
        <SocketContext.Provider value={socket}>
          <Switch>
            <Route path="/kiosk/:pairId/preview" component={Preview} />
            <Route path="/kiosk" component={Kiosk} />
            <Route path="/remote" component={Remote} />
            <Route path="/" component={Home} />
          </Switch>
        </SocketContext.Provider>
      </StoreProvider>
    </Router>
  );
}

export default App;
