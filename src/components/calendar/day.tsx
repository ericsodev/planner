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
      onClick={(e) => {
        onClick(date);
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`${
        highlightedStyle ||
        "bg-slate-50 text-gray-600 hover:bg-slate-200/70 focus:bg-slate-200/40"
      } text-md flex h-14 justify-start bg-slate-50 px-3.5 pt-2 align-top text-sm font-medium transition-colors duration-75 md:h-16 md:text-base lg:h-24 `}
    >
      {date ? dayjs(date).date() : ""}
    </div>
  );
}
