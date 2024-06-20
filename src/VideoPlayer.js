// src/VideoPlayer.js
import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ stream, id, isAudioDetected, muted }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().catch(error => {
                    console.error('Error attempting to play', error);
                });
            };
        }
    }, [stream]);

    return (
        <video
            id={id}
            ref={videoRef}
            style={{ display: isAudioDetected ? 'block' : 'none' }}
            autoPlay
            muted={muted}
        />
    );
};

export default VideoPlayer;
