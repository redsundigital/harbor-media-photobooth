import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SocketContext } from 'contexts';
import { StoreProvider } from 'store.js';
import socket from 'utils/socket';

import { Home, KioskHome, CameraPreview, RemoteHome } from 'components';

function App() {
  return (
    <Router>
      <StoreProvider>
        <SocketContext.Provider value={socket}>
          <Switch>
            <Route path="/kiosk/:pairId/preview" component={CameraPreview} />
            <Route path="/kiosk" component={KioskHome} />
            <Route path="/remote" component={RemoteHome} />
            <Route path="/" component={Home} />
          </Switch>
        </SocketContext.Provider>
      </StoreProvider>
    </Router>
  );
}

export default App;
