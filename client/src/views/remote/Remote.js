import React, { useState, useEffect, useContext } from 'react';
// import io from 'socket.io-client';

import { SocketContext } from 'contexts';
import { Flexbox } from 'components';

// const socket = io.connect();

/**
 * Extracts the camera ID from the window pathname.
 */
function getPairIdFromPath() {
  const { pathname } = window.location;
  return pathname.replace('/remote/', '');
}

function Remote() {
  const socket = useContext(SocketContext);
  const pairId = getPairIdFromPath();

  useEffect(() => {
    // Let the server know the remote is ready
    socket.emit('remote-ready', { pairId });
  });

  return (
    <Flexbox fullscreen center column>
      <p>Remote {pairId}</p>
    </Flexbox>
  );
}

export default Remote;
