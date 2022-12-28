import dayjs from "dayjs";
interface DayProps {
  date?: Date;
  onClick: (date?: Date) => void;
  highlightedStyle?: string;
}
export default function Day({
  date,
  onClick,
  highlightedStyle,
}: DayProps): JSX.Element {
  return (
    <div
      tabIndex={0}
      onClick={() => onClick(date)}
      className={`${
        highlightedStyle ||
        "bg-slate-50 text-gray-600 hover:bg-slate-200/70 focus:bg-slate-200/40"
      } text-md flex h-24 justify-start bg-slate-50 px-3 pt-2 align-top transition-colors duration-75 `}
    >
      {date ? dayjs(date).date() : ""}
    </div>
  );
}
