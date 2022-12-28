import type { RouterOutputs } from "@/utils/trpc";
import dayjs from "dayjs";
interface Props {
  plan: NonNullable<RouterOutputs["plans"]["getBySlug"]>;
}
export default function Sidebar({ plan }: Props): JSX.Element {
  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-xl font-medium text-gray-500">plan details</h1>
      <ul className=" flex flex-col gap-3 text-gray-600">
        <li>
          Created on{" "}
          <strong className="font-semibold">
            {dayjs(plan.createdAt).format("MMM D, YYYY")}
          </strong>{" "}
          at{" "}
          <strong className="font-semibold">
            {dayjs(plan.createdAt).format("h:m A")}
          </strong>
        </li>
        <li>
          Last updated on{" "}
          <strong className="font-semibold">
            {dayjs(plan.updatedAt).format("MMM D, YYYY")}
          </strong>{" "}
          at{" "}
          <strong className="font-semibold">
            {dayjs(plan.updatedAt).format("h:mm A")}
          </strong>
        </li>
        <li>
          Starts on{" "}
          <strong className="font-semibold">
            {dayjs(plan.startDate).format("MMM D, YYYY")}
          </strong>
        </li>
        <li>
          Ends on{" "}
          <strong className="font-semibold">
            {dayjs(plan.endDate).format("MMM D, YYYY")}
          </strong>
        </li>
      </ul>
    </div>
  );
}
