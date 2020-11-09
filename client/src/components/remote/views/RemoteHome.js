import React, { useEffect, useContext } from 'react';
import { SocketContext } from 'contexts';

import { Flex } from 'components';

/**
 * Extracts the camera ID from the window pathname.
 */
function getPairIdFromPath() {
  const { pathname } = window.location;
  return pathname.replace('/remote/', '');
}

function RemoteHome() {
  const socket = useContext(SocketContext);
  const pairId = getPairIdFromPath();

  useEffect(() => {
    // Let the server know the remote is ready
    socket.emit('remote-ready', { pairId });
  });

  return (
    <Flex fullscreen center column>
      <p>Remote {pairId}</p>
    </Flex>
  );
}

export default RemoteHome;
