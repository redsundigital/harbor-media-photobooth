import styled from 'styled-components';

const CaptureCanvas = styled.canvas`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  transform: scaleX(-1); // mirror image
`;

export default CaptureCanvas;
