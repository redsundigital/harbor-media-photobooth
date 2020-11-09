import React from 'react';
import { Flex } from 'components';
import CameraStream from '../components/CameraStream';
import queryString from 'query-string';

function CameraPreview(props) {
  const { id } = queryString.parse(props.location.search);

  return (
    <Flex fullscreen center column>
      <CameraStream kioskId={id} />
      {/* Overlay UI on top of CameraStream here... */}
    </Flex>
  );
}

export default CameraPreview;
