import Image from "next/image";
import { FaHeart, FaStar, FaComment, FaStarHalfStroke } from "react-icons/fa6";
import ProfilePicture from "@/assets/archie.jpg";

export const ReviewCard = () => {
  return (
    <section className="flex flex-row">
      {/** Profile Image / Left */}
      <Image
        src={ProfilePicture}
        alt={"Archie Bunker pfp"}
        className="w-10 h-10 border-opacity-100 border-white outline-white/10 -outline-offset-1  outline-1 outline rounded-full aspect-square my-4"
      />
      {/** Review section on right */}
      <div className="flex flex-col justify-start gap-4 p-4 text-sm">
        {/** Review Header */}
        <span className="text-xs flex flex-row gap-1 place-items-center">
          Review by
          <h4 className="text-header-light-grey font-medium">
            {/** User Name */}
            Archie Bunker
          </h4>
          {/** Star Rating */}
          <StarRating rating={4.5} />
          {/** CHECK IF USER LIKED THE MOVIE */}
          <FaHeart className="fill-accent-orange" />
          {/** Number of comments on review */}
          <h4 className="flex flex-row place-items-center gap-0.5">
            <FaComment className="fill-discrete-grey" />
            {"10"}
          </h4>
        </span>
        {/** Review text */}
        <p className="">
          {" "}
          “i'm sorry too, dimitri. i’m very sorry. all right, you're sorrier
          than i am! but i am sorry as well. i am as sorry as you are dimitri,
          don't say that you're more sorry than i am because i'm capable of
          being just as sorry as you are! so we’re both sorry, alright?”
        </p>
        {/** Number of likes on the review */}
        <span className="flex flex-row gap-2 place-items-center text-xs">
          <FaHeart></FaHeart>
          {"7,382 likes"}
        </span>
      </div>
    </section>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 0.5; i < rating; i++) {
    stars.push(<FaStar className="fill-accent-green-alt" key={i} />);
  }
  if (rating - stars.length) {
    stars.push(
      <FaStarHalfStroke className="fill-accent-green-alt" key={stars.length} />
    );
  }
  return <div className="flex flex-row gap-0">{stars}</div>;
};
