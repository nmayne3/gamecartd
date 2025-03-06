import Button from "@/components/button";
import Image from "next/image";
import HeroImage from "@/assets/ltp.jpg";
import { signIn, useSession } from "next-auth/react";
import { getCsrfToken } from "next-auth/react";
import ProvidersSignIn from "@/components/auth/providersSignIn";
import SignIn from "@/components/auth/credentialSignIn";
import { Separator } from "@radix-ui/react-menubar";
import { Card } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] h-full">
      <header
        id="Header Filler Block"
        className="w-full h-12 bg-primary drop-shadow-xl"
      />

      <div className="flex flex-row w-full min-h-[calc(100vh-8rem-3rem)] h-full">
        <Image
          priority={true}
          src={HeroImage}
          alt="Hero Image"
          className="basis-1/2 object-cover"
          draggable={false}
        />

        <div className=" basis-1/2 place-content-center background-pattern ">
          <Card className="min-w-96  max-w-lg  flex flex-col place-content-center place-items-start m-auto p-24 gap-4 self-center">
            <h1> Sign-In </h1>
            <SignIn />
            <div className="separator w-full ">
              <span className="px-2 "> or </span>
            </div>
            <ProvidersSignIn />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
