"use client";

import Button from "@/components/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PageButtons = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const page = Number(searchParams.get("page") || "1");

  const handlePage = useCallback(
    (inPage: number) => {
      console.log(`changing page...`);

      const params = new URLSearchParams(searchParams);
      if (inPage && inPage > 0) {
        params.set("page", inPage.toString());
      } else {
        params.delete("page");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace]
  );
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row w-full justify-between text-xs py-2">
        <Button onClick={() => handlePage(page - 1)}> Previous </Button>
        <Button onClick={() => handlePage(page + 1)}> Next </Button>
      </div>
    </div>
  );
};

export default PageButtons;
