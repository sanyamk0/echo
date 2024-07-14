import { useState } from "react";
import Card from "../shared/Card";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";

const StepOtp = () => {
  const [otp, setOtp] = useState("");

  async function submit() {
    try {
      console.log(otp);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center mt-24">
        <Card title="Enter the code we just texted you">
          <TextInput
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="mt-10">
            <Button onClick={submit} text="Next" />
          </div>
          <p className="text-[#c4c5c5] w-[95%] my-0 mx-auto mt-5">
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
