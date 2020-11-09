import React from 'react';

import { Flex } from 'components';
import CameraStream from '../components/CameraStream';

function CameraPreview() {
  return (
    <Flex fullscreen center column>
      <CameraStream />
      {/* Overlay UI on top of CameraStream here... */}
    </Flex>
  );
}

export default CameraPreview;
