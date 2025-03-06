"use client";

import { signIn } from "next-auth/react";
import Button from "../button";

const ProvidersSignIn = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        onClick={() => {
          signIn("github", { callbackUrl: "/" });
        }}
      >
        {" "}
        Sign In with Github{" "}
      </Button>
      <Button
        onClick={async () => {
          await signIn("discord", { callbackUrl: "/" });
        }}
      >
        {" "}
        Sign In with Discord{" "}
      </Button>
    </div>
  );
};

export default ProvidersSignIn;
