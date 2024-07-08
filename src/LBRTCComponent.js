import { useState, useEffect, useRef } from 'react';
import VolumeDetector from './AudioDetector';
import VideoPlayer from './VideoPlayer';

const LBRTCComponent = ({ threshold = 20 }) => {
    const [currentVolume, setCurrentVolume] = useState(0);
    const [displayedVolume, setDisplayedVolume] = useState(0);
    const volumeRef = useRef(currentVolume);

    useEffect(() => {
        volumeRef.current = currentVolume;
    }, [currentVolume]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayedVolume(volumeRef.current);
        }, 4000);

        return () => clearInterval(interval);
    }, []);


    const isAudioDetected = currentVolume > threshold || displayedVolume > threshold;

    return (
        <div>
            <h2>Current Volume: {currentVolume}</h2>
            <h2>Displayed Volume: {displayedVolume}</h2>
            <VolumeDetector onVolumeChange={setCurrentVolume} />
            <VideoPlayer isAudioDetected={isAudioDetected} muted={true} />
        </div>
    );
};

export default LBRTCComponent;