import type { RouterOutputs } from "@/utils/trpc";
import dayjs from "dayjs";
import { useState } from "react";
import Day from "./day";
import { Header } from "./header";

type Members = NonNullable<RouterOutputs["plans"]["getBySlug"]>["member"];

interface Props {
  highlightedDates?: { [key: string]: string };
  initialDate?: Date;
  onClick?: (date: Date) => void;
}

const DOW_PREFIXES = ["S", "M", "T", "W", "T", "F", "S"];
export default function Calendar({
  initialDate,
  highlightedDates,
  onClick,
}: Props): JSX.Element {
  const [month, setMonth] = useState<Date>(initialDate ?? new Date());

  const prevMonth = prevMonthHandler(setMonth);
  const nextMonth = nextMonthHandler(setMonth);
  return (
    <div className="">
      <Header
        month={dayjs(month).format("MMMM")}
        year={dayjs(month).format("YYYY")}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      ></Header>

      <div className="grid w-full grid-cols-7 items-stretch justify-items-stretch gap-[2px] border-2 border-slate-100 bg-slate-100 transition-[height]">
        {
          // Day of week header
          DOW_PREFIXES.map((v, i) => {
            return (
              <div
                key={`dow-${i}`}
                className="bg-slate-50 py-1 text-center font-medium text-gray-500"
              >
                {v}
              </div>
            );
          })
        }
        {
          // Empty Cells Start
          Array.from(
            { length: dayjs(month).startOf("month").day() },
            (_, i) => (
              <Day key={`empty-start-cell-${i}`} onClick={prevMonth}></Day>
            )
          )
        }
        {
          // Day cells
          Array.from({ length: dayjs(month).daysInMonth() }, (_, i) => {
            const date = dayjs(month).startOf("month").add(i, "day");
            return (
              <Day
                highlightedStyle={
                  highlightedDates?.hasOwnProperty(
                    date.startOf("day").toISOString()
                  )
                    ? highlightedDates[date.startOf("day").toISOString()]
                    : undefined
                }
                key={`daycell-${i}`}
                onClick={() => {
                  if (onClick) onClick(date.toDate());
                }}
                date={date.toDate()}
              ></Day>
            );
            // return <div></div>;
          })
        }
        {
          // Empty Cells End
          Array.from(
            { length: 7 - dayjs(month).endOf("month").day() - 1 },
            (_, i) => (
              <Day key={`empty-start-cell-${i}`} onClick={nextMonth}></Day>
            )
          )
        }
      </div>
    </div>
  );
}

const prevMonthHandler = (
  setState: React.Dispatch<React.SetStateAction<Date>>
): (() => void) => {
  return () => {
    setState((prev) =>
      dayjs(prev).subtract(1, "month").startOf("month").toDate()
    );
  };
};

const nextMonthHandler = (
  setState: React.Dispatch<React.SetStateAction<Date>>
): (() => void) => {
  return () => {
    setState((prev) => dayjs(prev).add(1, "month").startOf("month").toDate());
  };
};
