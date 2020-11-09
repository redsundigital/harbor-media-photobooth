import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { generateId } from 'utils';
import { kioskSocket } from '../kioskSocket';
import { Flex } from 'components';
import QRCode from '../components/QRCode';

function KioskHome() {
  const history = useHistory();
  const pairId = generateId(6);
  const remoteUrl = `${window.location.origin}/remote/${pairId}`;

  function goToCameraPreview() {
    history.push(`/kiosk/${pairId}/preview`);
  }

  useEffect(() => {
    kioskSocket.pair(pairId, goToCameraPreview);
  });

  return (
    <Flex fullscreen center column>
      <QRCode code={remoteUrl} />
      <a href={remoteUrl} target="_blank" rel="noopener noreferrer">
        Remote
      </a>
    </Flex>
  );
}

export default KioskHome;
