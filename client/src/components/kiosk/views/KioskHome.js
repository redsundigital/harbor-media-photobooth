import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { generateId } from 'utils';
import { Flex } from 'components';
import QRCode from '../components/QRCode';
import socket from 'utils/socket';

function KioskHome() {
  const history = useHistory();
  const kioskId = generateId(6);
  const remoteUrl = `${window.location.origin}/remote/${kioskId}`;

  function goToCameraPreview() {
    history.push(`/kiosk/preview?id=${kioskId}`);
  }

  useEffect(() => {
    // Go to camera preview when a remote connects with a matching id.
    socket.on('remote-connected', (remoteId) => {
      if (kioskId === remoteId) goToCameraPreview();
    });
  });

  return (
    <Flex fullscreen center column>
      <QRCode code={remoteUrl} />
      <a href={remoteUrl} target="_blank" rel="noopener noreferrer">
        Remote {kioskId}
      </a>
    </Flex>
  );
}

export default KioskHome;
