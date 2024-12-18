import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import NewListForm from "@/components/lists/newlist";

const NewListPage = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  return (
    <main>
      <header id="Header Filler Block" className="w-full h-12 bg-primary" />
      <div className="bg-[url('https://s.ltrbxd.com/static/img/content-bg.4284ab72.png')] bg-repeat-x w-full h-full">
        <section className="max-w-screen-lg mx-auto py-8">
          <h1 className="font-sans font-light text-trimary w-full border-b pb-1">
            {" "}
            {`New List`}{" "}
          </h1>
          <NewListForm />
        </section>
      </div>
    </main>
  );
};

export default NewListPage;
