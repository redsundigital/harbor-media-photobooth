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
  const [snapshot, setSnapshot] = useState(null);
  const id = getPairIdFromUrl();

  function takeSnapshot() {
    socket.emit('take-snapshot', id);
  }

  useEffect(() => {
    // Let the server know a remote app has connected.
    // Sends the ID so a Kiosk with a matching ID can pair with it.
    socket.emit('remote-connected', id);

    socket.on('snapshot-taken', ({ kioskId, base64Image }) => {
      if (kioskId !== id) return;
      setSnapshot(base64Image);
    });
  }, []);

  return (
    <Flex fullscreen center column>
      <p>Remote {id}</p>
      <br />
      {snapshot ? (
        <button onClick={() => setSnapshot(null)}>Clear</button>
      ) : (
        <button onClick={takeSnapshot}>Take Snapshot</button>
      )}
      <br />
      {snapshot && (
        <img
          src={snapshot}
          alt="snapshot"
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
      )}
    </Flex>
  );
}

export default RemoteHome;
