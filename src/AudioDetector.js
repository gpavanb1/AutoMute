import React, { useState, useEffect, useCallback } from 'react';

const VolumeDetector = ({ fftSize = 256, onVolumeChange }) => {
    const [isRunning, setIsRunning] = useState(false);

    const startAudioContext = useCallback(() => {
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let analyser = audioContext.createAnalyser();
        let microphone;

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;

                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                const updateVolume = () => {
                    analyser.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
                    onVolumeChange(average);
                    requestAnimationFrame(updateVolume);
                };

                updateVolume();
                setIsRunning(true);
            })
            .catch((err) => {
                console.error('Error accessing microphone:', err);
            });

        return () => {
            if (microphone) {
                microphone.disconnect();
            }
            if (analyser) {
                analyser.disconnect();
            }
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [onVolumeChange]);

    useEffect(() => {
        if (isRunning) {
            const cleanup = startAudioContext();
            return cleanup;
        }
    }, [isRunning, startAudioContext]);

    return (
        <div>
            <button onClick={startAudioContext} disabled={isRunning}>
                {isRunning ? 'Listening...' : 'Start Listening'}
            </button>
        </div>
    );
};

export default VolumeDetector;
