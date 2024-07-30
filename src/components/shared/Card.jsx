const Card = ({ title, children }) => {
  return (
    <div className="min-w-[300px] w-[500px] max-w-[90%] min-h-[300px] bg-[#1d1d1d] p-[30px] rounded-[20px] flex flex-col justify-center items-center">
      <div className="flex items-center justify-center mb-7">
        {title && (
          <h1 className="text-[22px] font-bold ml-2 text-center">{title}</h1>
        )}
      </div>
      {children}
    </div>
  );
};

export default Card;
