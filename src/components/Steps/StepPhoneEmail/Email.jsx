import { useState } from "react";
import Card from "../../shared/Card";
import Button from "../../shared/Button";
import TextInput from "../../shared/TextInput";

const Email = ({ onNext }) => {
  const [email, setEmail] = useState("");

  async function submit() {
    try {
      onNext();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card title="Enter Your Email Id">
      <TextInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        <div className="mt-10">
          <Button text="Next" onClick={submit} />
        </div>
        <p className="text-[#c4c5c5] w-[95%] my-0 mx-auto mt-5">
          By entering your email, you are agreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Email;
