import { SpinnerIcon } from "@/components/icons";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <section className="h-full w-full min-h-screen m-auto">
      <div className="absolute flex flex-row gap-2 w-full top-1/3 mx-auto text-center place-items-center justify-self-center justify-center">
        <SpinnerIcon /> {"Loading..."}
      </div>
    </section>
  );
}
