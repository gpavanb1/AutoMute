// src/VideoPlayer.js
import React, { useRef, useEffect, useState } from 'react';

const VideoPlayer = ({ isAudioDetected, muteOnlyAudio, showStats }) => {
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

    // Criteria for muting video and audio
    // Transmit audio if detected
    const muteAudio = isAudioDetected ? false : true;
    // Transmit video always if muteOnlyAudio is true
    // Else muteVideo selectively depending on audio detection
    const showVideo = muteOnlyAudio ? true : (isAudioDetected ? true : false);

    return (
        <div>
            {showStats && <h2>Video: {showVideo ? 'Showing...' : 'Hiding...'}</h2>}
            {showStats && <h2>Audio: {muteAudio ? 'Muted...' : 'Unmuted...'}</h2>}
            <video
                ref={videoRef}
                style={{ display: showVideo ? 'block' : 'none' }}
                autoPlay
                muted={muteAudio}
            />
        </div>

    );
};

export default VideoPlayer;
