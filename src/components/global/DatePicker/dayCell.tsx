import dayjs from "dayjs";
import type { SetStateAction } from "react";

interface DayCellProps {
  date: Date;
  selectedDate: Date;
  setDate: React.Dispatch<SetStateAction<Date>>;
}
export default function DayCell(props: DayCellProps) {
  let style = "text-gray-600 hover:bg-gray-200";
  if (dayjs(props.date).isSame(props.selectedDate, "day")) {
    style = "text-purple-700 bg-purple-200/70 hover:bg-purple-200/80";
  } else if (dayjs(props.date).isSame(new Date(), "day")) {
    style = "text-gray-800 bg-gray-300/80 hover:bg-gray-300";
  }
  return (
    <div
      className={`} cursor-pointer select-none rounded-md p-1.5 text-center font-medium transition ${style}`}
      onClick={() => {
        props.setDate(dayjs(props.date).endOf("day").toDate());
      }}
    >
      {dayjs(props.date).date()}
    </div>
  );
}
