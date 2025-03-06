"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import ProvidersSignIn from "./providersSignIn";
import SignUpForm from "./signUpForm";

const SignUpDialog = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger> {trigger} </DialogTrigger>
      <DialogContent className="px-10 py-8">
        <DialogHeader>
          {" "}
          <h1 className="font-sans font-normal text-medium text-discrete-grey uppercase">
            Join Gamecartd
          </h1>{" "}
        </DialogHeader>
        <SignUpForm />
        <div className="separator w-full ">
          <span className="px-2 "> or </span>
        </div>
        <ProvidersSignIn />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
