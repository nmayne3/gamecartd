import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import SignIn from "./credentialSignIn";
import ProvidersSignIn from "./providersSignIn";

const SignInDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="header-text"> Sign In </DialogTrigger>
      <DialogContent className="px-10 py-8">
        <DialogHeader>
          {" "}
          <h1 className="font-sans font-normal text-medium text-discrete-grey uppercase">
            Sign In
          </h1>{" "}
        </DialogHeader>
        <SignIn />
        <div className="separator w-full ">
          <span className="px-2 "> or </span>
        </div>
        <ProvidersSignIn />
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
