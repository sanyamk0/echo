import { useEffect, useState } from "react";
import { selectUser } from "../app/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { FaHandPeace } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { getRoomAsync } from "../app/rooms/roomsSlice";
import { useWebRTC } from "../hooks/useWebRTC";

const Room = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: roomId } = useParams();
  const user = useSelector(selectUser);
  const [room, setRoom] = useState(null);
  const [isMute, setIsMute] = useState(true);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);

  const handleManualLeave = () => {
    navigate("/rooms");
  };

  const handleMuteClick = (clientId) => {
    if (clientId !== user._id) return;
    setIsMute((isMute) => !isMute);
  };

  useEffect(() => {
    handleMute(isMute, user._id);
  }, [isMute]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await dispatch(getRoomAsync(roomId)).unwrap();
        setRoom(() => data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoom();
  }, [roomId, dispatch]);

  return (
    <div>
      <div className="w-[1200px] max-w-[90%] my-0 mx-auto">
        <button
          onClick={handleManualLeave}
          className="flex items-center bg-none outline-none mt-8"
        >
          <FaArrowLeft />
          <span className="font-bold text-white text-base ml-4">
            All Voice Rooms
          </span>
        </button>
      </div>
      <div className="bg-[#1d1d1d] mt-16 rounded-tr-[20px] rounded-tl-[20px] min-h-[calc(100vh-205px)] p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{room?.topic}</h2>
          <div className="flex items-center">
            <button className="bg-[#262626] outline-none ml-8 flex items-center py-[0.7rem] px-4 rounded-[20px] text-white  transition-all duration-300 ease-in-out hover:bg-[#333333]">
              <HiOutlineHandRaised />
            </button>
            <button
              onClick={handleManualLeave}
              className="bg-[#262626] outline-none ml-8 flex items-center py-[0.7rem] px-4 rounded-[20px] text-white  transition-all duration-300 ease-in-out hover:bg-[#333333]"
            >
              <FaHandPeace />
              <span className="font-bold ml-4">Leave Quietly</span>
            </button>
          </div>
        </div>
        <div className="mt-8 flex items-center flex-wrap gap-8">
          {clients.map((client) => {
            return (
              <div className="flex flex-col items-center" key={client._id}>
                <div className="w-24 h-24 rounded-full relative border-[3px] border-solid border-[#5453e0]">
                  <audio
                    ref={(instance) => provideRef(instance, client._id)}
                    autoPlay
                  ></audio>
                  <img
                    className="w-full h-full rounded-full"
                    src={client.avatar}
                    alt="avatar"
                  />
                  <button
                    onClick={() => handleMuteClick(client._id)}
                    className="flex items-center justify-center bg-[#212121] absolute bottom-0 right-0 w-8 h-8 box-content rounded-[30px] p-1 shadow-md"
                  >
                    {client.muted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                  </button>
                </div>
                <h4 className="font-bold mt-4">{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
