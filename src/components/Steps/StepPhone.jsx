import { useState } from "react";
import Card from "../shared/Card";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";
import { useDispatch } from "react-redux";
import { sendOtpAsync } from "../../app/auth/authSlice";
import { toast } from "sonner";

const StepPhone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();

  async function submit() {
    if (
      !phoneNumber ||
      phoneNumber.trim().length < 10 ||
      phoneNumber.trim().length > 10
    ) {
      toast.warning("Please enter a valid Phone Number!!");
      return;
    }
    try {
      await dispatch(sendOtpAsync(phoneNumber)).unwrap();
      onNext();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!!");
    }
  }

  return (
    <div className="flex items-center justify-center mt-24">
      <Card title="Enter Your Phone Number">
        <TextInput
          type="number"
          value={phoneNumber}
          required
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <div>
          <div className="mt-10">
            <Button text="Next" onClick={submit} />
          </div>
          <p className="text-[#c4c5c5] w-[95%] my-0 mx-auto mt-5 text-center">
            By entering your number, you are agreeing to our Terms of Service
            and Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default StepPhone;
