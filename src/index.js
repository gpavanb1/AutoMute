import React, { useState, useEffect, useRef } from 'react';
import VolumeDetector from './AudioDetector';
import VideoPlayer from './VideoPlayer';

const AutoMute = ({ fftSize = 256, threshold = 20, timeout = 4000, showStats = true, startListening = true }) => {
    const [currentVolume, setCurrentVolume] = useState(0);
    const [displayedVolume, setDisplayedVolume] = useState(0);
    const volumeRef = useRef(currentVolume);

    useEffect(() => {
        volumeRef.current = currentVolume;
    }, [currentVolume]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayedVolume(volumeRef.current);
        }, timeout);

        return () => clearInterval(interval);
    }, [timeout]);


    const isAudioDetected = currentVolume > threshold || displayedVolume > threshold;

    return (
        <div>
            {showStats && <h2>Current Volume: {currentVolume}</h2>}
            {showStats && <h2>Displayed Volume: {displayedVolume}</h2>}
            <VolumeDetector fftSize={fftSize} onVolumeChange={setCurrentVolume} isRunning={startListening} showStats={showStats} />
            <VideoPlayer isAudioDetected={isAudioDetected} muted={true} />
        </div>
    );
};

export default AutoMute;