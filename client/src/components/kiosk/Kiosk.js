import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SocketContext } from 'contexts';
import { useStore } from 'store.js';

import { Flex } from 'components';
import QRCode from './QRCode';

function Kiosk() {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const { pairId } = useStore().state;
  const pairUrl = `${window.location.origin}/remote/${pairId}`;

  const linkToRemote = (
    <a href={pairUrl} target="_blank" rel="noopener noreferrer">
      {pairUrl}
    </a>
  );

  function goToCameraPreview() {
    history.push(`/kiosk/${pairId}/preview`);
  }

  useEffect(() => {
    // Let the server know the kiosk is ready
    socket.emit('kiosk-ready', { pairId });

    // Go to the camera preview when a socket
    // msg with a matching pairId is received.
    socket.on(pairId, goToCameraPreview);
  });

  return (
    <Flex fullscreen center column>
      <QRCode code={pairUrl} />
      {linkToRemote}
    </Flex>
  );
}

export default Kiosk;
