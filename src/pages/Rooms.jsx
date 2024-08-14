import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { IoMdSearch } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import AddRoomModal from "./AddRoomModal";
import { useDispatch } from "react-redux";
import { getAllRoomsAsync } from "../app/rooms/roomsSlice";

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await dispatch(getAllRoomsAsync()).unwrap();
        setRooms(data);
        setFilteredRooms(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, [dispatch]);

  useEffect(() => {
    const filtered = rooms.filter((room) =>
      room.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [searchQuery, rooms]);

  return (
    <>
      <div className="w-[1200px] max-w-[90%] my-0 mx-auto mb-4">
        <div className="flex items-center justify-between my-5 mx-0 gap-5">
          <div className="flex items-center">
            <span className="text-xl font-bold border-b-2">
              All Voice Rooms
            </span>
            <div className="bg-[#262626] ml-5 flex items-center py-0 px-2 min-w-[30%] rounded-[20px]">
              <IoMdSearch className="w-5 h-5" />
              <input
                type="text"
                className="bg-transparent border-none outline-none p-2 text-[#fff] w-full"
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-[#20bd5f] py-2 px-5 rounded-[20px] text-[#fff] transition-all duration-300 ease-in-out hover:bg-[#0f6632]"
            >
              <IoPersonAdd className="w-5 h-5" />
              <span className="text-base ml-2">Room</span>
            </button>
          </div>
        </div>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 mt-14">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Rooms;
