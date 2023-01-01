import { Disclosure } from "@headlessui/react";
import type { RouterOutputs } from "@/utils/trpc";
import dayjs from "dayjs";

type Plan = NonNullable<RouterOutputs["plans"]["getBySlug"]>;

interface Props {
  plan: Plan;
  selectedDate: Date;
}
export function MembersList({ plan, selectedDate }: Props): JSX.Element {
  const availableMembers = plan.member.filter((m) =>
    m.availableTimes.reduce(
      (prev, time) => dayjs(selectedDate).isSame(time, "day") || prev,
      false
    )
  );
  const unavailableMembers = plan.member.filter(
    (m) =>
      !m.availableTimes.reduce(
        (prev, time) => dayjs(selectedDate).isSame(time, "day") || prev,
        false
      )
  );
  return (
    <>
      <Disclosure defaultOpen={true} as="div" className="mb-4">
        <Disclosure.Button>
          <h1 className="text-base font-semibold text-violet-500">
            Available Members &mdash; ({availableMembers.length} /{" "}
            {plan.member.length})
          </h1>
        </Disclosure.Button>
        <Disclosure.Panel>
          <ul className="flex flex-col gap-1 text-gray-800">
            {availableMembers.map((v, i) => {
              return <li key={i}>{v.name}</li>;
            })}
          </ul>
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure defaultOpen={true} as="div">
        <Disclosure.Button>
          <h1 className="text-base font-semibold text-violet-500">
            Unavailable Members &mdash; ({unavailableMembers.length} /{" "}
            {plan.member.length})
          </h1>
        </Disclosure.Button>
        <Disclosure.Panel>
          <ul className="flex flex-col gap-1 text-gray-800">
            {unavailableMembers.map((v, i) => {
              return <li key={i}>{v.name}</li>;
            })}
          </ul>
        </Disclosure.Panel>
      </Disclosure>
    </>
  );
}
