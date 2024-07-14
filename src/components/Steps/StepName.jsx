import { useState } from "react";
import Card from "../shared/Card";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";

const StepName = ({ onNext }) => {
  const name = "sanyam";
  const [username, setUsername] = useState(name);

  function nextStep() {
    onNext();
  }

  return (
    <>
      <div className="flex items-center justify-center mt-24">
        <Card title="What is your full name?">
          <TextInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="w-[70%] text-center my-5 mx-auto">
            People use real names at Echo :) !
          </p>
          <div>
            <Button onClick={nextStep} text="Next" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepName;
