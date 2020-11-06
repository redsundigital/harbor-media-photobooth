// Tutorial for react that helped get the media stream working.
// Also has stuff for video positioning and camera snapshot.
// https://blog.logrocket.com/responsive-camera-component-react-hooks/

import React, { useRef } from 'react';
import styled from 'styled-components';
import { useUserMedia } from './hooks';

// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
const mediaOptions = {
  audio: false,
  video: {
    facingMode: 'user', // might be different mode on raspberry pi,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
};

const VideoContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  background: #333;
  overflow: hidden;
`;

const VideoPlayer = styled.video`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  transform: ${(props) => props.mirror && 'scaleX(-1)'};
  object-fit: cover;
`;

function CameraStream() {
  const videoRef = useRef();
  const mediaStream = useUserMedia(mediaOptions);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  const handleCanPlay = () => {
    videoRef.current.play();
  };

  return (
    <VideoContainer>
      <VideoPlayer mirror ref={videoRef} onCanPlay={handleCanPlay} autoPlay muted playsInline />
    </VideoContainer>
  );
}

export default CameraStream;
