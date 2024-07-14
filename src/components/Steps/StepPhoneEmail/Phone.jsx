import { useState } from "react";
import Card from "../../shared/Card";
import Button from "../../shared/Button";
import TextInput from "../../shared/TextInput";

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  async function submit() {
    try {
      onNext();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Card title="Enter Your Phone Number">
      <TextInput
        type="number"
        value={phoneNumber}
        required
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div>
        <div className="mt-10">
          <Button text="Next" onClick={submit} />
        </div>
        <p className="text-[#c4c5c5] w-[95%] my-0 mx-auto mt-5">
          By entering your number, you are agreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Phone;
