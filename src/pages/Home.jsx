import { useNavigate } from "react-router-dom";
import Button from "../components/shared/Button";
import Card from "../components/shared/Card";

const Home = () => {
  let navigate = useNavigate();

  const startRegister = () => {
    navigate("/authenticate");
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-24">
        <Card title="Welcome to Echo!">
          <p className="leading-[1.6] text-[#c4c5c5] text-center mb-7">
            We are working hard to get Echo ready for everyone! While we wrap up
            the finishing youches, we are adding people gradually to make sure
            nothing breaks
          </p>
          <div>
            <Button onClick={startRegister} text="Let's Go" />
          </div>
          <div className="mt-5">
            <span className="text-[#0077ff]">Have an invite text?</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
