import { FaLinkedin, FaGithub } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full h-24 bg-dark-grey place-content-center">
      <div className="flex flex-row gap-16 place-items-center justify-center max-w-screen-md m-auto p-">
        <div className="flex flex-row gap-2 font-semibold text-sm">
          <h4>{"About  "}</h4>
          <h4> Contact </h4>
        </div>
        <span className="flex flex-row place-items-center gap-2">
          <FaLinkedin className="fill-discrete-grey/50 hover:fill-discrete-grey" />
          <FaGithub className="fill-discrete-grey/50 hover:fill-discrete-grey" />
        </span>
      </div>
      <p className="text-xs text-discrete-grey/50 max-w-screen-lg w-fit m-auto font-sans my-2">
        {" "}
        Thank you for checking out my website !{" "}
      </p>
    </footer>
  );
};

export default Footer;