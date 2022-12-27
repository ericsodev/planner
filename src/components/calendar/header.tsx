import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

interface Props {
  month: string;
  year: string;
  prevMonth: () => void;
  nextMonth: () => void;
}
export function Header({
  month,
  year,
  prevMonth,
  nextMonth,
}: Props): JSX.Element {
  return (
    <div className="grid grid-cols-[10ch_5ch_1fr] gap-6 rounded-t-lg bg-slate-100 p-4">
      <h3 className="font-semibold text-gray-600">{month}</h3>
      <h3 className="font-medium text-gray-400/90">{year}</h3>

      <div className="flex gap-2">
        <button
          onClick={prevMonth}
          className="rounded-md text-slate-500 transition-colors hover:bg-slate-300/70 focus:bg-slate-300/50"
        >
          <MdOutlineNavigateBefore className="text-2xl"></MdOutlineNavigateBefore>
        </button>
        <button
          onClick={nextMonth}
          className="rounded-md text-slate-500 transition-colors hover:bg-slate-300/70 focus:bg-slate-300/50"
        >
          <MdOutlineNavigateNext className="text-2xl"></MdOutlineNavigateNext>
        </button>
      </div>
    </div>
  );
}
