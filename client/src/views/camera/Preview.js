import React, { useContext, useEffect } from 'react';

import { SocketContext } from 'contexts';
import { Flexbox } from 'components';
import { useStore } from 'store.js';

function Preview() {
  const socket = useContext(SocketContext);
  const { pairId } = useStore();

  useEffect(() => {
    socket.emit('preview');
  });

  return (
    <Flexbox fullscreen center column>
      <video></video>
      <canvas></canvas>
    </Flexbox>
  );
}

export default Preview;
