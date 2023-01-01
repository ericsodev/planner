import type { RouterOutputs } from "@/utils/trpc";
import dayjs from "dayjs";
import { MembersList } from "./membersList";

interface Props {
  selectedDate: Date | null;
  plan: NonNullable<RouterOutputs["plans"]["getBySlug"]>;
}
export default function Sidebar({ selectedDate, plan }: Props): JSX.Element {
  if (!selectedDate) return <></>;

  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-xl font-medium text-gray-500">
          {dayjs(selectedDate).format("MMM D, YYYY").toLowerCase()}
        </h1>
      </div>
      <MembersList selectedDate={selectedDate} plan={plan}></MembersList>
    </div>
  );
}
