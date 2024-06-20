// src/WebRTCComponent.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import useUserMedia from './hooks/useUserMedia';
import io from 'socket.io-client';
import VideoPlayer from './VideoPlayer';

const socket = io('http://localhost:5000');

const WebRTCComponent = () => {
    const [peers, setPeers] = useState([]);
    const [isAudioDetected, setIsAudioDetected] = useState(false);
    const { mediaStream: userMedia, error } = useUserMedia({ video: true, audio: true });
    const peerRefs = useRef({});
    const audioTimeout = useRef(null);

    useEffect(() => {
        if (userMedia) {
            socket.emit('join', 'roomId'); // Replace 'roomId' with a dynamic room ID if needed
        }
    }, [userMedia]);

    const addPeer = useCallback((peerId, initiator = false) => {
        const peer = new SimplePeer({
            initiator,
            trickle: false,
            stream: userMedia,
        });

        peer.on('signal', (data) => {
            socket.emit('signal', { peerId, signalData: data });
        });

        peer.on('stream', (remoteStream) => {
            const videoElement = document.getElementById(peerId);
            if (videoElement) {
                videoElement.srcObject = remoteStream;
            }
        });

        peerRefs.current[peerId] = peer;
        setPeers((prevPeers) => [...prevPeers, peerId]);
    }, [userMedia]);

    const handleAudioDetection = useCallback(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContext.createMediaStreamSource(userMedia);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        mediaStreamSource.connect(analyser);

        const detectAudio = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

            if (average > 10) {
                if (audioTimeout.current) {
                    clearTimeout(audioTimeout.current);
                }
                setIsAudioDetected(true);
                audioTimeout.current = setTimeout(() => {
                    setIsAudioDetected(false);
                }, 2000); // Maintain video on for at least 2 seconds
            }

            requestAnimationFrame(detectAudio);
        };

        detectAudio();
    }, [userMedia]);

    useEffect(() => {
        socket.on('new-peer', (peerId) => {
            addPeer(peerId, false);
        });

        socket.on('signal', ({ peerId, signalData }) => {
            if (peerRefs.current[peerId]) {
                peerRefs.current[peerId].signal(signalData);
            }
        });

        socket.on('peer-disconnected', (peerId) => {
            if (peerRefs.current[peerId]) {
                peerRefs.current[peerId].destroy();
                delete peerRefs.current[peerId];
                setPeers((prevPeers) => prevPeers.filter((id) => id !== peerId));
            }
        });
    }, [addPeer]);

    useEffect(() => {
        if (userMedia) {
            handleAudioDetection();
        }
    }, [userMedia, handleAudioDetection]);

    if (error) {
        return <div>Error accessing media devices: {error.message}</div>;
    }

    return (
        <div>
            <VideoPlayer id="local-video" stream={userMedia} isAudioDetected={isAudioDetected} muted />
            {peers.map((peerId) => (
                <VideoPlayer key={peerId} id={peerId} stream={peerRefs.current[peerId]?.remoteStream} />
            ))}
        </div>
    );
};

export default WebRTCComponent;
