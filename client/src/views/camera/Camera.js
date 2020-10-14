import React, { useEffect, useContext } from 'react';
import QRCode from 'qrcode.react';
import { useHistory } from 'react-router-dom';

import { SocketContext } from 'contexts';
import { Flexbox } from 'components';
import { useStore } from 'store.js';

// TODO: use styled-components
const styles = {
  containerStyle: {
    padding: '1rem',
    boxShadow: '0 0 3rem rgba(0, 0, 0, 0.15)',
  },
  qrStyle: { padding: '0.5rem' },
  codeStyle: {
    letterSpacing: '1px',
    fontSize: '1.5rem',
    fontWeight: '300',
    textAlign: 'center',
    textDecoration: 'none',
    padding: '1rem 0 0 0',
    color: 'black',
  },
};

/**
 * Create url for remote/{camera-id}.
 * This is probably for development only
 * since the QR code will be scanned in production.
 *
 * @param {*} pairId
 */
function getUrlToRemote(pairId) {
  return `${window.location.origin}/remote/${pairId}`;
}

function Camera() {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const { pairId } = useStore().state;
  const urlToRemote = getUrlToRemote(pairId);

  useEffect(() => {
    // Let the server know the camera is ready
    socket.emit('camera-ready', { pairId });

    // This listener will trigger when a remote app
    // with a matching pairId connected to the server.
    socket.on(pairId, () => {
      // Go to the camera preview.
      history.push(`/camera/${pairId}/preview`);
    });
  });

  return (
    <Flexbox fullscreen center column>
      <Flexbox center column style={styles.containerStyle}>
        <QRCode value={urlToRemote} size={500} style={styles.qrStyle} bgColor="transparent" />
        <a href={urlToRemote} style={styles.codeStyle} target="_blank" rel="noopener noreferrer">
          {urlToRemote}
        </a>
      </Flexbox>
    </Flexbox>
  );
}

export default Camera;
