"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Rating } from "@prisma/client";
import { FaStar, FaStarHalfStroke } from "react-icons/fa6";

const chartConfig = {
  ratings: {
    label: "Individual Ratings",
  },
  desktop: {
    label: "Desktop",
    color: "#436",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type dataPair = {
  rating: number;
  total: number;
};

export function RatingsChart({
  ratings,
  className,
}: {
  ratings: Rating[];
  className?: string;
}) {
  const data = Array<dataPair>();
  for (let i = 0; i < 5; i++) {
    data.push({
      rating: i + 1,
      total: ratings.filter((a) => a.rating == i + 1).length,
    });
  }

  return (
    <Card
      className={`bg-background text-discrete-grey outline-none border-none h-[80px] ${className}`}
    >
      <CardContent className="p-0 flex flex-row place-items-end max-h-full">
        <div className="text-accent-green self-end">★</div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[80px] pb-1 w-full "
        >
          <BarChart
            accessibilityLayer={true}
            data={data}
            margin={{
              left: 4,
              right: 4,
            }}
            barGap={0}
          >
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-fit bg-secondary outline outline-dark-grey outline-0.5"
                  hideLabel
                  formatter={(value, name, item) => {
                    console.log(item);
                    return (
                      <span className="*:fill-header-light-grey text-header-light-grey">
                        {`${value} `}
                        <StarRating rating={item.payload.rating} />
                        {` ratings (${
                          data.length > 0
                            ? (item.payload.total / data.length) * 100
                            : 0
                        }%)`}
                      </span>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey={"total"}
              fill={`hsl(var(--secondary))`}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <div className="flex flex-col self-end place-items-center h-full">
          <span
            id="mean rating"
            className="item-center text-xl font-light text-discrete-grey/80"
          >
            {ratings.reduce((acc, rating) => acc + rating.rating, 0) /
              ratings.length}
          </span>
          <div className="text-accent-green ">★★★★★</div>
        </div>
      </CardContent>
    </Card>
  );
}

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 0.5; i < rating; i++) {
    stars.push("★");
  }
  if (rating - stars.length) {
    stars.push("½");
  }
  return <div className="flex-row gap-0 inline-flex">{stars}</div>;
};
