import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { StoreProvider } from 'store.js';

import { Home, KioskHome, CameraPreview, RemoteHome } from 'components';

function App() {
  return (
    <Router>
      <StoreProvider>
        <Switch>
          <Route path="/kiosk/preview" component={CameraPreview} />
          <Route path="/kiosk" component={KioskHome} />
          <Route path="/remote" component={RemoteHome} />
          <Route path="/" component={Home} />
        </Switch>
      </StoreProvider>
    </Router>
  );
}

export default App;
