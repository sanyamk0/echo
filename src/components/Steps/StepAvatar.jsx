import { useState } from "react";
import Card from "../shared/Card";
import Button from "../shared/Button";
import Loader from "../shared/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  activateAccountAsync,
  selectAvatar,
  selectName,
  setAvatar,
} from "../../app/activate/activateSlice";

const StepAvatar = () => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const name = useSelector(selectName);
  const avatar = useSelector(selectAvatar);
  const dispatch = useDispatch();

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  }

  async function submit() {
    if (!name || !avatar) return;
    setLoading(true);
    try {
      dispatch(activateAccountAsync({ name, avatar }));
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
