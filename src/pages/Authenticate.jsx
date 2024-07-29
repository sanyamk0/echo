import { useState } from "react";
import StepPhone from "../components/Steps/StepPhone";
import StepOtp from "../components/Steps/StepOtp";

const steps = {
  1: StepPhone,
  2: StepOtp,
};

const Authenticate = () => {
  const [step, setStep] = useState(1);
  const Step = steps[step];

  function onNext() {
    setStep(step + 1);
  }

  return <Step onNext={onNext} />;
};

export default Authenticate;
