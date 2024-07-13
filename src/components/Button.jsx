import { FaArrowRight } from "react-icons/fa";

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#0077ff] hover:bg-[#014a9c] py-[10px] px-5 border-none outline-none flex items-center my-0 mx-auto text-white text-lg font-bold rounded-[50px] cursor-pointer transition-all duration-300 ease-in-out"
    >
      <span>{text}</span>
      <FaArrowRight className="ml-2" />
    </button>
  );
};

export default Button;
