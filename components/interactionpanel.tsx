import { useSession } from "next-auth/react";
import PlayedButton from "./playedbutton";
import { LikeButton, BacklogButton } from "./playedbutton";
import { StarRating } from "./reviewwindow";

const InteractionPanelWrapper = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <aside className="basis-1/4">
      <section
        id="Review/Interaction Table"
        className={`flex flex-col bg-secondary rounded-sm place-content-center w-full divide-y-1 divide-primary text-sm *:p-2 text-center place-items-center *:w-full ${className}`}
      >
        {children}
      </section>
    </aside>
  );
};

export default InteractionPanelWrapper;
