import dayjs from "dayjs";
import type { SetStateAction } from "react";
import { useRef, useState } from "react";
import DayCell from "./dayCell";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface DatePickerPopupProps {
  initialDate?: Date;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
}

const DOW_PREFIXES = ["S", "M", "T", "W", "T", "F", "S"];
export default function DatePickerPopup(props: DatePickerPopupProps) {
  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>();
  const [shownMonth, setShownMonth] = useState<Date>(
    props.initialDate ?? new Date()
  );
  const fdow = dayjs(shownMonth).set("date", 1).day(); // this is the index for the first day of the month
  const dayComponents = [];
  for (let i = 0; i < fdow; i++) dayComponents.push(<div></div>);
  for (let i = 0; i < dayjs(shownMonth).daysInMonth(); i++)
    dayComponents.push(
      <DayCell
        key={`day-${i}`}
        selectedDate={props.selectedDate}
        setDate={props.setSelectedDate}
        date={dayjs(shownMonth)
          .set("date", i + 1)
          .toDate()}
      ></DayCell>
    );
  const nextMonth = () => {
    setShownMonth((date) => dayjs(date).add(1, "month").toDate());
  };
  const prevMonth = () => {
    setShownMonth((date) => dayjs(date).subtract(1, "month").toDate());
  };
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-8 rounded-md bg-gray-100 p-5 shadow-md"
    >
      <div className="grid grid-cols-10 items-center justify-center gap-2">
        <h1 className="col-span-3 text-lg font-semibold text-gray-700">
          {dayjs(shownMonth).format("MMMM")}
        </h1>
        <h1 className="text-md col-span-2 font-medium text-gray-500">
          {dayjs(shownMonth).format("YYYY")}
        </h1>
        <div className="col-span-5 flex flex-row gap-2">
          <div className="rounded-md p-1.5 hover:bg-gray-200">
            <MdOutlineNavigateBefore
              onClick={prevMonth}
              className="text-2xl"
            ></MdOutlineNavigateBefore>
          </div>
          <div className="rounded-md p-1.5 hover:bg-gray-200">
            <MdOutlineNavigateNext
              onClick={nextMonth}
              className="text-2xl "
            ></MdOutlineNavigateNext>
          </div>
        </div>
      </div>
      <div
        className="align-stretch justify-stretch grid grid-cols-7 items-center gap-4 transition-all"
        ref={parent}
      >
        {DOW_PREFIXES.map((v, i) => {
          return (
            <h1
              key={`dow-${i}`}
              className="text-center font-medium text-gray-500"
            >
              {v}
            </h1>
          );
        })}
        {dayComponents}
      </div>
    </div>
  );
}
