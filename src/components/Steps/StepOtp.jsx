import { useEffect, useState } from "react";
import Card from "../shared/Card";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";
import { useDispatch, useSelector } from "react-redux";
import {
  selectError,
  selectHashToken,
  selectOtp,
  selectPhone,
  verifyOtpAsync,
} from "../../app/auth/authSlice";
import { toast } from "sonner";

const StepOtp = () => {
  const [otp, setOtp] = useState("");
  const phoneNumber = useSelector(selectPhone);
  const generatedOtp = useSelector(selectOtp);
  const hashToken = useSelector(selectHashToken);
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  async function submit() {
    if (!otp || !phoneNumber || !hashToken) {
      toast.warning("Please enter a valid OTP!!");
      return;
    }
    try {
      dispatch(verifyOtpAsync({ phoneNumber, otp, hashToken }));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (error) toast.error(`Error: ${error.message}`);
    if (generatedOtp) toast.success(`OTP: ${generatedOtp}`);
  }, [generatedOtp, error]);

  return (
    <>
      <div className="flex items-center justify-center mt-24">
        <Card title="Enter the code we just texted you">
          <TextInput
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <div className="mt-10">
            <Button onClick={submit} text="Next" />
          </div>
          <p className="text-[#c4c5c5] w-[95%] my-0 mx-auto mt-5 text-center">
            By entering your number, you are agreeing to our Terms of Service
            and Privacy Policy. Thanks!
          </p>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
