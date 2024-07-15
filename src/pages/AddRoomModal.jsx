import { useState } from "react";
import TextInput from "../components/shared/TextInput";
import { IoClose } from "react-icons/io5";

const AddRoomModal = ({ onClose }) => {
  const [roomType, setRoomType] = useState("open");
  const [topic, setTopic] = useState("");

  const createRoom = async () => {
    if (!topic || !roomType) return;
    try {
      console.log("create room");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div className="w-[50%] max-w-[500px] bg-[#1d1d1d] rounded-[20px] relative">
        <button onClick={onClose} className="absolute right-1 top-2 bg-none">
          <IoClose className="w-5 h-5 mr-2 mt-2" />
        </button>
        <div className="p-[30px] border-b-2 border-solid border-[#262626]">
          <h3 className="mb-1 font-semibold">
            Enter the topic to be disscussed
          </h3>
          <TextInput
            fullwidth="true"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <h2 className="text-lg my-[10px] mx-0 font-bold">Room Types</h2>
          <div className="grid grid-cols-3 gap-[30px]">
            <div
              onClick={() => setRoomType("open")}
              className={`flex flex-col items-center p-[10px] rounded-[10px] cursor-pointer ${
                roomType === "open" ? "bg-[#262626]" : ""
              }`}
            >
              <img src="/images/globe.png" alt="globe" className="h-10 w-10" />
              <span>Open</span>
            </div>
            <div
              onClick={() => setRoomType("social")}
              className={`flex flex-col items-center p-[10px] rounded-[10px] cursor-pointer ${
                roomType === "social" ? "bg-[#262626]" : ""
              }`}
            >
              <img
                src="/images/social.png"
                alt="social"
                className="h-10 w-10"
              />
              <span>Social</span>
            </div>
            <div
              onClick={() => setRoomType("private")}
              className={`flex flex-col items-center p-[10px] rounded-[10px] cursor-pointer ${
                roomType === "private" ? "bg-[#262626]" : ""
              }`}
            >
              <img src="/images/lock.png" alt="lock" className="h-10 w-10" />
              <span>Private</span>
            </div>
          </div>
        </div>
        <div className="p-[30px] text-center">
          <h2 className="mb-5 font-bold text-xl">
            Start a room, open to everyone
          </h2>
          <button
            onClick={createRoom}
            className="bg-[#20bd5f] text-[#fff] flex items-center w-[200px] justify-center py-[7px] px-[10px] rounded-[20px] my-0 mx-auto transition-all duration-300 ease-in-out hover:bg-[#20bd5f]"
          >
            <img
              src="/images/celebration.png"
              alt="celebration"
              className="h-10 w-10"
            />
            <span className="ml-[5px] font-bold">Let&apos;s go</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
