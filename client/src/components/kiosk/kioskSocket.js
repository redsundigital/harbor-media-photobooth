import socket from 'utils/socket';

export const kioskSocket = {
  pair(pairId, onPair) {
    // Tell server kiosk {pairId} is ready
    socket.emit('kiosk-ready', { pairId });

    // Listen for a reply from server with a matching pair ID,
    // then callback with onPair.
    socket.on(pairId, onPair);

    socket.on('snapshot-response', (data) => {
      console.log(1, data);
    });
  },
};
