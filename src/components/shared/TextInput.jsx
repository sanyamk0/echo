const TextInput = (props) => {
  return (
    <div>
      <input
        className="bg-[#323232] border-none py-[10px] px-5 w-[200px] text-white text-lg rounded-[10px] outline-none"
        style={{
          width: props.fullwidth === "true" ? "100%" : "inherit",
        }}
        {...props}
      />
    </div>
  );
};

export default TextInput;
