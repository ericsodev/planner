import dayjs from "dayjs";
import { useProps } from "./propContext";

interface DayCellProps {
  date: Date;
}
export default function DayCell(props: DayCellProps) {
  const {
    selectedDates,
    highlightedDates,
    selectableDates,
    toggleDate,
    setDate,
  } = useProps();
  let style = "text-gray-600 hover:bg-gray-200";
  if (containsDate(selectedDates ?? [], props.date)) {
    style = "text-purple-700 bg-purple-200/70 hover:bg-purple-200/80";
  } else if (containsDate(highlightedDates ?? [], props.date)) {
    style = "text-purple-700 bg-gray-300/50 hover:bg-gray-300/60";
  } else if (dayjs(props.date).isSame(new Date(), "day")) {
    style = "text-gray-800 bg-gray-300/80 hover:bg-gray-300";
  }
  const handleClick = () => {
    if (!selectableDates || containsDate(selectableDates, props.date)) {
      if (toggleDate) {
        toggleDate(dayjs(props.date).endOf("day").toDate());
        console.log("toggle");
      } else if (setDate) {
        setDate(dayjs(props.date).endOf("day").toDate());
      }
    }
  };
  return (
    <div
      className={`} cursor-pointer select-none rounded-md p-1.5 text-center font-medium transition ${style}`}
      onClick={handleClick}
    >
      {dayjs(props.date).date()}
    </div>
  );
}

function containsDate(selectedDates: Date[], date: Date): boolean {
  for (const i of selectedDates) {
    if (dayjs(i).isSame(date, "day")) {
      return true;
    }
  }
  return false;
}
