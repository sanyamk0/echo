import { useStateWithCallback } from "./useStateWithCallback";
import { useSocket } from "./useSocket";
import { useCallback, useEffect, useRef } from "react";
import { ACTIONS } from "../../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const { socket } = useSocket();
  const [clients, setClients] = useStateWithCallback([]);
  const socketRef = useRef(null);
  const localMediaStream = useRef(null);
  const audioElements = useRef({}); // key - userId
  const connections = useRef({}); // key - socketId

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client._id === newClient._id);
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  // Capture Media
  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };
    // After capturing the media, add the user to the clients list
    startCapture().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user._id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
        if (socketRef.current)
          socketRef.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });
    return () => {
      if (localMediaStream.current)
        localMediaStream.current.getTracks().forEach((track) => track.stop());
      if (socketRef.current) socketRef.current.emit(ACTIONS.LEAVE);
    };
  }, []);

  // Handle new peer
  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      // If already connected give warning
      if (peerId in connections.current) {
        return console.warn(
          `You are already connected with ${peerId} (${user.name})`
        );
      }
      // Store new connection in the connections object
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });
      // Handle new ice Candidate
      connections.current[peerId].onicecandidate = (event) => {
        // Relay ice candidate to the peer
        socketRef.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          iceCandidate: event.candidate,
        });
      };
      // Handle ontrack on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser._id]) {
            audioElements.current[remoteUser._id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser._id]) {
                audioElements.current[remoteUser._id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };
      // Add local tracks to remote connections
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });
      // Create Offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        // Set local description
        await connections.current[peerId].setLocalDescription(offer);
        // Send offer to server
        socketRef.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };
    if (socketRef.current)
      socketRef.current.on(ACTIONS.ADD_PEER, handleNewPeer);
    return () => {
      if (socketRef.current) socketRef.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  // Handle ice candidate
  useEffect(() => {
    const handleIceCandidate = ({ peerId, iceCandidate }) => {
      if (iceCandidate) {
        connections.current[peerId].addIceCandidate(iceCandidate);
      }
    };
    if (socketRef.current)
      socketRef.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
    return () => {
      if (socketRef.current) socketRef.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // Handle sdp
  useEffect(() => {
    const handleRemoteSessionDescription = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );
      // if session description is offer then create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);
        socketRef.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };
    if (socketRef.current)
      socketRef.current.on(
        ACTIONS.SESSION_DESCRIPTION,
        handleRemoteSessionDescription
      );
    return () => {
      if (socketRef.current) socketRef.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  // Handle remove peer
  useEffect(() => {
    const handleRemovePeer = async ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }
      delete connections.current[peerId];
      delete audioElements.current[peerId];
      setClients((list) => list.filter((client) => client._id !== userId));
    };
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
    }
    return () => {
      socketRef.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  // Initialize socketRef with the socket instance
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  return { clients, provideRef };
};
