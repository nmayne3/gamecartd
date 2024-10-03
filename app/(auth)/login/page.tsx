import Button from "@/components/button";
import Image from "next/image";
import HeroImage from "@/assets/ltp.jpg";

const Login = () => {
  return (
    <div className="flex flex-row">
      <Image src={HeroImage} alt="Hero Image" className="basis-1/2" />
      <div className="mt-24 flex flex-col place-content-center place-items-center mx-auto p-8 gap-4">
        <h1> Sign-In </h1>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-semibold"> Username </h2>
            <input
              type="text"
              className="text-field"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <h2 className="font-semibold"> Password </h2>

            <input
              type="password"
              className="text-field"
              placeholder="Password"
            />
          </div>
        </div>
        <Button className={""}> Login </Button>
      </div>
    </div>
  );
};

export default Login;
