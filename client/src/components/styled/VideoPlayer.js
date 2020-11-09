import styled from 'styled-components';

const VideoPlayer = styled.video`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 98;
  transform: scaleX(-1); // mirror image
  object-fit: cover;
`;

export default VideoPlayer;
