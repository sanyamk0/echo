import { useState } from "react";
import Card from "../shared/Card";
import Button from "../shared/Button";
import Loader from "../shared/Loader";

const StepAvatar = () => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
    };
  }

  async function submit() {
    setLoading(true);
    try {
      console.log("activate");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return loading ? (
    <Loader message="Activation in Progress..." />
  ) : (
    <>
      <div className="flex items-center justify-center mt-24">
        <Card title={`Okay, name`}>
          <p className="text-[#c4c5c5] text-center mb-5">
            How&apos;s this photo?
          </p>
          <div className="mb-4 w-[110px] h-[110px] border-[6px] border-solid border-[#0077ff] rounded-full flex items-center justify-center overflow-hidden">
            <label
              className="my-[30px] mx-0 inline-block cursor-pointer"
              htmlFor="avatarInput"
            >
              <img
                src={image}
                className="h-[90%] w-[90%] object-cover"
                alt="avatar"
              />
              <input
                id="avatarInput"
                type="file"
                className="hidden"
                onChange={captureImage}
              />
            </label>
          </div>
          <div>
            <Button onClick={submit} text="Next" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepAvatar;
