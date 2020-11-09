import React, { useRef, useState } from 'react';
import { useUserMedia } from '../hooks';
import { CaptureCanvas, VideoContainer, VideoPlayer } from 'components/styled';

/**
 * Options to use once media permission is granted.
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
const userMediaOptions = {
  audio: false,
  video: {
    facingMode: 'user', // might be different mode on raspberry pi,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
};

/**
 * Shows a video stream and handles taking a snapshot.
 *
 * Tutorial for react that helped get the media stream working:
 * https://blog.logrocket.com/responsive-camera-component-react-hooks/
 * Also has stuff for video positioning and camera snapshot.
 */
function CameraStream() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const mediaStream = useUserMedia(userMediaOptions);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);

  // Set the video element's source to the media stream if valid.
  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  /**
   * Plays the video stream.
   */
  function handleCanPlay() {
    videoRef.current.play();
  }

  /**
   * Takes a snapshot of the video stream and draws it on the canvas.
   */
  function handleCapture() {
    const context = canvasRef.current.getContext('2d');

    // TODO:
    // Destination values are only working with 1280x720 (userMedia video max size for my webcam)
    // Should adjust automatically
    context.drawImage(
      videoRef.current, // source
      0, // src x
      0, // src y
      videoRef.current.offsetWidth, // src Width
      videoRef.current.offsetHeight, // src Height
      0, // dest x
      0, // dest y
      videoRef.current.offsetWidth, // dest Width
      videoRef.current.offsetHeight // dest Height
    );

    // canvasRef.current.toBlob((blob) => ongotpointercapture(blob), 'image/jpeg', 1);
    setIsCanvasEmpty(false);
  }

  /**
   * Clears the canvas.
   */
  function handleClear() {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setIsCanvasEmpty(true);
  }

  return (
    <VideoContainer>
      <VideoPlayer ref={videoRef} onCanPlay={handleCanPlay} autoPlay muted playsInline />
      <CaptureCanvas
        ref={canvasRef}
        width={videoRef.current?.offsetWidth}
        height={videoRef.current?.offsetHeight}
        onClick={isCanvasEmpty ? handleCapture : handleClear}></CaptureCanvas>
    </VideoContainer>
  );
}

export default CameraStream;
