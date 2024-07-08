// src/VideoPlayer.js
import React, { useRef, useEffect, useState } from 'react';

const VideoPlayer = ({ isAudioDetected, muted }) => {
    const [stream, setStream] = useState(null);
    const videoRef = useRef();

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        getMediaStream();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

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
            ref={videoRef}
            style={{ display: isAudioDetected ? 'block' : 'none' }}
            autoPlay
            muted={muted}
        />

    );
};

export default VideoPlayer;
