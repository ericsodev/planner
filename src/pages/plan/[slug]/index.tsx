import Calendar from "@/components/calendar";
import Error from "@/components/error";
import Loading from "@/components/loading";
import MembersSidebar from "@/components/membersSidebar";
import { RouterOutputs, trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

type Plan = RouterOutputs["plans"]["getBySlug"];
const highlightedClasses = {
  0: "bg-green-50 text-green-600 hover:bg-green-200/70 focus:bg-green-100/90",
  1: "bg-green-100 text-green-700 hover:bg-green-200/70 focus:bg-green-100/90",
  2: "bg-green-200/70 text-green-700 hover:bg-green-200 focus:bg-green-200/60",
  3: "bg-green-300/70 text-green-800 hover:bg-green-300/90 focus:bg-green-300/50",
  4: "bg-green-400/70 text-green-900 hover:bg-green-400/70 focus:bg-green-400/90",
  5: "bg-green-500/75 text-green-900 hover:bg-green-500/70 focus:bg-green-500/90",
};

const PlanPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const {
    data: plan,
    isLoading,
    isError,
  } = trpc.plans.getBySlug.useQuery(
    {
      slug: typeof slug === "string" ? slug : "",
    },
    {
      retry: 2,
      enabled: typeof slug === "string",
    }
  );

  const highlightedDates: { [key: string]: string } = {};
  if (plan) {
    for (const [date, percent] of Object.entries(getPercentsTotal(plan))) {
      highlightedDates[date] = getHighlightedStyle(percent * 100);
    }
  }

  if (!slug || typeof slug !== "string") return <></>; // TODO: redirect to error page;
  return (
    <>
      {isError && <Error></Error>}
      {isLoading && <Loading></Loading>}
      {plan && (
        <div className="grid min-h-screen grid-cols-[1fr_3fr_1fr] gap-6 bg-slate-50 px-12 py-6">
          <MembersSidebar
            setSelectedMember={setSelectedMember}
            selectedMember={selectedMember}
            member={plan.member}
          ></MembersSidebar>
          <div className="flex flex-col gap-12">
            <h1 className="text-center text-xl">{plan.title}</h1>
            <Calendar highlightedDates={highlightedDates}></Calendar>
          </div>
        </div>
      )}
    </>
  );
};

function getPercentsTotal(plan: Plan): { [key: string]: number } {
  if (dayjs(plan.startDate).isAfter(plan.endDate, "day")) return {};
  const availableMembers: { [key: string]: number } = {};
  const totalMembers = plan.member.length;
  let curr = dayjs(plan.startDate);
  while (!dayjs(plan.endDate).isBefore(curr, "day")) {
    for (const member of plan.member) {
      for (const time of member.availableTimes) {
        if (curr.isSame(time, "day")) {
          const key = curr.startOf("day").toISOString();
          if (availableMembers.hasOwnProperty(key)) {
            availableMembers[key]++;
          } else {
            availableMembers[key] = 1;
          }
        }
      }
    }
    curr = dayjs(curr).add(1, "day");
  }

  for (const date in availableMembers) {
    availableMembers[date] /= totalMembers;
  }

  return availableMembers;
}
function getHighlightedStyle(percent: number): string {
  if (percent < 1) return highlightedClasses[0];
  else if (1 < percent && percent <= 20) return highlightedClasses[1];
  else if (20 < percent && percent <= 40) return highlightedClasses[2];
  else if (40 < percent && percent <= 60) return highlightedClasses[3];
  else if (60 < percent && percent <= 80) return highlightedClasses[4];
  else return highlightedClasses[5];
}

export default PlanPage;
