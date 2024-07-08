import { useState, useEffect, useRef } from 'react';
import VolumeDetector from './AudioDetector';
import VideoPlayer from './VideoPlayer';

const WebRTCComponent = ({ threshold = 20 }) => {
    const [currentVolume, setCurrentVolume] = useState(0);
    const [displayedVolume, setDisplayedVolume] = useState(0);
    const volumeRef = useRef(currentVolume);
    const displayRef = useRef(displayedVolume);

    useEffect(() => {
        volumeRef.current = currentVolume;
    }, [currentVolume]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayedVolume(volumeRef.current);
            displayRef.current = displayedVolume;
        }, 4000);

        return () => clearInterval(interval);
    }, []);


    return (
        <div>
            <h2>Current Volume: {currentVolume}</h2>
            <h2>Displayed Volume: {displayedVolume}</h2>
            <VolumeDetector onVolumeChange={setCurrentVolume} />
            <VideoPlayer isAudioDetected={true} muted={true} />
        </div>
    );
};

export default WebRTCComponent;