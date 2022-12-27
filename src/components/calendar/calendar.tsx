import { useAutoAnimate } from "@formkit/auto-animate/react";
import dayjs from "dayjs";
import { useState } from "react";
import { Header } from "./header";
import Day from "./day";
import { trpc } from "@/utils/trpc";

interface HighlightedDate {
  day: Date;
  style: string;
}

interface Props {
  highlightedDates?: HighlightedDate[];
  initialDate?: Date;
  onClick?: (date: Date) => void;
}

const DOW_PREFIXES = ["S", "M", "T", "W", "T", "F", "S"];
const highlightedClasses = {
  0: "bg-green-50 text-green-700 hover:bg-green-200/70 focus:bg-green-100/90",
  1: "bg-green-100 text-green-700 hover:bg-green-200/70 focus:bg-green-100/90",
  2: "bg-green-200/70 text-green-700 hover:bg-green-200 focus:bg-green-200/60",
  3: "bg-green-300/60 text-green-800 hover:bg-green-300/90 focus:bg-green-300/50",
  4: "bg-green-400/60 text-green-300 hover:bg-green-400/70 focus:bg-green-400/90",
  5: "bg-green-500/60 text-green-300 hover:bg-green-500/70 focus:bg-green-500/90",
};
export default function Calendar({
  initialDate,
  highlightedDates,
  onClick,
}: Props): JSX.Element {
  // const trpc = []
  const [month, setMonth] = useState<Date>(initialDate ?? new Date());
  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

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

      <div
        className="grid w-full grid-cols-7 items-stretch justify-items-stretch gap-[2px] border-2 border-slate-100 bg-slate-100"
        ref={parent}
      >
        {
          // Day of week header
          DOW_PREFIXES.map((v, i) => {
            return (
              <div
                key={`dow-${i}`}
                className="bg-slate-50 text-center font-medium text-gray-500"
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
            const date = dayjs(month).startOf("month").add(i, "day").toDate();
            return (
              <Day
                highlightedStyle={highlightedClasses[3]}
                key={`daycell-${i}`}
                onClick={() => {
                  if (onClick) onClick(date);
                }}
                date={date}
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
function getHighlightedStyle(
  availableMembers: number,
  totalMembers: number
): string | undefined {
  const percent = (availableMembers / totalMembers) * 100;
  if (availableMembers == 0) return highlightedClasses[0];
  else if (0 < percent && percent <= 20) return highlightedClasses[1];
  else if (20 < percent && percent <= 40) return highlightedClasses[2];
  else if (40 < percent && percent <= 60) return highlightedClasses[3];
  else if (60 < percent && percent <= 80) return highlightedClasses[4];
  else return highlightedClasses[5];
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
