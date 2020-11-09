import socket from 'utils/socket';

export function remoteSocket(id) {
  return {
    emitReady() {
      socket.emit('remote-connected', { id });

      socket.on('test', (data) => {
        console.log('test', data);
      });
    },

    takePicture() {
      socket.emit('snapshot-request', { id });
    },
  };
}
