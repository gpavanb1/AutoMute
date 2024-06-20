// src/hooks/useUserMedia.js
import { useState, useEffect, useCallback } from 'react';

const useUserMedia = (requestedMedia) => {
    const [mediaStream, setMediaStream] = useState(null);
    const [error, setError] = useState(null);

    const getUserMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
            setMediaStream(stream);
        } catch (err) {
            setError(err);
        }
    }, [requestedMedia]);

    useEffect(() => {
        getUserMedia();
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [getUserMedia, mediaStream]);

    return { mediaStream, error };
};

export default useUserMedia;
