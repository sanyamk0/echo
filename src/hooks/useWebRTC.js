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
  const clientsRef = useRef([]);
  const audioElements = useRef({}); // key - userId
  const connections = useRef({}); // key - socketId

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clientsRef.current.find(
        (client) => client._id === newClient._id
      );
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [setClients]
  );

  const captureMedia = async () => {
    try {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    } catch (err) {
      console.error("Error Capturing Media: ", err);
    }
  };

  const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
    if (peerId in connections.current) {
      return console.warn(
        `You are already connected with ${peerId} (${user.name})`
      );
    }

    connections.current[peerId] = new RTCPeerConnection({
      iceServers: freeice(),
    });
    const peerConnection = connections.current[peerId];

    peerConnection.onicecandidate = (event) => {
      if (socketRef.current && event.candidate) {
        socketRef.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          iceCandidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = ({ streams: [remoteStream] }) => {
      addNewClient({ ...remoteUser, muted: true }, () => {
        const audioElement = audioElements.current[remoteUser._id];
        if (audioElement) {
          audioElement.srcObject = remoteStream;
        } else {
          const interval = setInterval(() => {
            if (audioElement) {
              audioElement.srcObject = remoteStream;
              clearInterval(interval);
            }
          }, 1000);
        }
      });
    };

    localMediaStream.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localMediaStream.current);
    });

    if (createOffer) {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        if (socketRef.current) {
          socketRef.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          });
        }
      } catch (error) {
        console.error("Error Creating Offer: ", error);
      }
    }
  };

  const handleIceCandidate = ({ peerId, iceCandidate }) => {
    const connection = connections.current[peerId];
    if (connection && iceCandidate) {
      connection.addIceCandidate(iceCandidate);
    }
  };

  const handleRemoteSdp = async ({ peerId, sessionDescription: remoteSdp }) => {
    const connection = connections.current[peerId];
    try {
      connection.setRemoteDescription(new RTCSessionDescription(remoteSdp));
      if (remoteSdp.type === "offer") {
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);
        if (socketRef.current) {
          socketRef.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePeer = async ({ peerId, userId }) => {
    const connection = connections.current[peerId];
    if (connection) {
      connection.close();
      delete connections.current[peerId];
      delete audioElements.current[peerId];
      setClients((list) => list.filter((client) => client._id !== userId));
    }
  };

  const handleMute = (isMute, userId) => {
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        if (isMute) {
          if (socketRef.current)
            socketRef.current.emit(ACTIONS.MUTE, { roomId, userId });
        } else {
          if (socketRef.current)
            socketRef.current.emit(ACTIONS.UN_MUTE, { roomId, userId });
        }
        clearInterval(interval);
      }
    }, 200);
  };

  const socketCbMute = ({ peerId, userId }) => {
    setMute(true, userId);
  };

  const socketCbUnMute = ({ peerId, userId }) => {
    setMute(false, userId);
  };

  const setMute = (mute, userId) => {
    const clientIdx = clientsRef.current
      .map((client) => client._id)
      .indexOf(userId);
    const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
    if (clientIdx > -1) {
      connectedClients[clientIdx].muted = mute;
      setClients(connectedClients);
    }
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = socket;
      await captureMedia();

      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user._id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });

      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.JOIN, { roomId, user });
        socketRef.current.on(ACTIONS.ADD_PEER, handleNewPeer);
        socketRef.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
        socketRef.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);
        socketRef.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
        socketRef.current.on(ACTIONS.MUTE, socketCbMute);
        socketRef.current.on(ACTIONS.UN_MUTE, socketCbUnMute);
      }
    };

    init();

    return () => {
      if (localMediaStream.current)
        localMediaStream.current.getTracks().forEach((track) => track.stop());
      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.LEAVE);
        socketRef.current.off(ACTIONS.ADD_PEER);
        socketRef.current.off(ACTIONS.ICE_CANDIDATE);
        socketRef.current.off(ACTIONS.SESSION_DESCRIPTION);
        socketRef.current.off(ACTIONS.REMOVE_PEER);
        socketRef.current.off(ACTIONS.MUTE);
        socketRef.current.off(ACTIONS.UN_MUTE);
      }
    };
  }, []);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  return { clients, provideRef, handleMute };
};
