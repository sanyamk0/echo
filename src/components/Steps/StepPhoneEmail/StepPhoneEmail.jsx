import { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import Phone from "../StepPhoneEmail/Phone";
import Email from "../StepPhoneEmail/Email";

const phoneEmailMap = {
  phone: Phone,
  email: Email,
};

const StepPhoneEmail = ({ onNext }) => {
  const [type, setType] = useState("phone");
  const Component = phoneEmailMap[type];

  return (
    <>
      <div className="flex items-center justify-center mt-24">
        <div>
          <div className="mb-5 flex items-center justify-start">
            <button
              className={`w-[60px] h-[60px] border-none outline-none rounded-[10px] cursor-pointer flex items-center justify-center 
              ${type === "phone" ? "bg-[#0077ff]" : "bg-[#262626]"}`}
              onClick={() => setType("phone")}
            >
              <FaPhoneAlt />
            </button>
            <button
              className={`w-[60px] h-[60px] border-none outline-none rounded-[10px] cursor-pointer flex items-center justify-center ml-5
              ${type === "email" ? "bg-[#0077ff]" : "bg-[#262626]"}`}
              onClick={() => setType("email")}
            >
              <MdOutlineMailOutline />
            </button>
          </div>
          <Component onNext={onNext} />
        </div>
      </div>
    </>
  );
};

export default StepPhoneEmail;
