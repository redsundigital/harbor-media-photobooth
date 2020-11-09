import React, { useEffect, useState } from 'react';
import { Flex } from 'components';
import socket from 'utils/socket';

/**
 * Extracts the camera ID from the window pathname.
 */
function getPairIdFromUrl() {
  const { pathname } = window.location;
  return pathname.replace('/remote/', '');
}

function RemoteHome() {
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const id = getPairIdFromUrl();

  function takeSnapshot() {
    socket.emit('take-snapshot', id);
  }

  function clearSnapshot() {
    socket.emit('clear-snapshot', id);
  }

  useEffect(() => {
    // Let the server know a remote app has connected.
    // Sends the ID so a Kiosk with a matching ID can pair with it.
    socket.emit('remote-connected', id);

    socket.on('snapshot-taken', (kioskId) => {
      if (kioskId !== id) return;
      setSnapshotTaken(true);
    });

    socket.on('snapshot-cleared', (kioskId) => {
      if (kioskId !== id) return;
      setSnapshotTaken(false);
    });

    console.log('render');
  }, []);

  return (
    <Flex fullscreen center column>
      <p>Remote {id}</p>
      <br />
      {snapshotTaken ? (
        <button onClick={clearSnapshot}>Clear</button>
      ) : (
        <button onClick={takeSnapshot}>Take Snapshot</button>
      )}
    </Flex>
  );
}

export default RemoteHome;
