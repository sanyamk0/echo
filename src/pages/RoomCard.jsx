import { IoMdPerson } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/room/${room._id}`);
      }}
      className="bg-[#1d1d1d] p-5 rounded-[10px] cursor-pointer"
    >
      <h3 className="text-base ml-2">{room.topic}</h3>
      <div className="flex">
        {room.speakers.slice(0, 2).map((speaker, index) => (
          <div
            key={speaker._id}
            className={`flex items-center mt-2 ${
              index === 1 ? "-ml-6 mt-11" : ""
            }`}
          >
            <img
              src={speaker.avatar}
              alt="avatar"
              className="rounded-full object-cover border-2 border-solid border-[#20bd5f] bg-[#1d1d1d] w-10 h-10"
            />
          </div>
        ))}
        <div className="flex items-center relative my-5 mx-0 ml-5">
          <div className="flex flex-col">
            {room.speakers.slice(0, 2).map((speaker) => (
              <div key={speaker._id} className="ml-5 flex">
                <span className="pb-1 inline-block mr-1">{speaker.name}</span>
                <IoChatbubbleEllipses className="w-3 h-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <span className="font-bold mr-1">{room?.totalPeople}</span>
        <IoMdPerson className="w-5 h-5" />
      </div>
    </div>
  );
};

export default RoomCard;
