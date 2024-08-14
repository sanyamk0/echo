import { useState } from "react";
import Card from "../shared/Card";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { selectName, setName } from "../../app/activate/activateSlice";
import { toast } from "sonner";

const StepName = ({ onNext }) => {
  const name = useSelector(selectName);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(name);

  function nextStep() {
    if (!username) {
      toast.warning("Please enter a valid Name!!");
      return;
    }
    dispatch(setName(username));
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
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && nextStep()}
          />
          <p className="w-[70%] text-center my-5 mx-auto">
            People use real names at Echo : )
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
