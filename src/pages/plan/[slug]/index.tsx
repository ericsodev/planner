import NotFound from "@/components/NotFound";
import Calendar from "@/components/calendar";
import Error from "@/components/error";
import Loading from "@/components/loading";
import MembersSidebar from "@/components/membersSidebar";
import PlanDetailsSidebar from "@/components/planDetailsSidebar";
import { RouterOutputs, trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoLink } from "react-icons/io5";

type Plan = NonNullable<RouterOutputs["plans"]["getBySlug"]>;
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
  if (!selectedMember) {
    if (plan) {
      for (const [date, percent] of Object.entries(getPercentsTotal(plan))) {
        highlightedDates[date] = getHighlightedStyle(percent * 100);
      }
    }
  } else {
    if (plan) {
      const reducedPlan = { ...plan };
      reducedPlan.member = reducedPlan.member.filter(
        (member) => member.id === selectedMember
      );
      for (const [date, percent] of Object.entries(
        getPercentsTotal(reducedPlan)
      )) {
        highlightedDates[date] = getHighlightedStyle(percent * 100);
      }
    }
  }

  if (!slug || typeof slug !== "string") return <></>; // TODO: redirect to error page;
  return (
    <>
      {isError && <Error></Error>}
      {isLoading && <Loading></Loading>}
      {plan === null && <NotFound></NotFound>}
      {plan && (
        <div className="grid min-h-screen grid-cols-[1fr_3fr_1fr] gap-6 bg-slate-50 px-12 py-12">
          <Head>
            <title>{plan.title}</title>
          </Head>
          <MembersSidebar
            setSelectedMember={setSelectedMember}
            selectedMember={selectedMember}
            member={plan.member}
          ></MembersSidebar>
          <div className="flex flex-col gap-12">
            <div className="flex flex-row items-center justify-center gap-4">
              <h1 className="text-center text-xl text-gray-800">
                {plan.title}
              </h1>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.toString())
                }
                className="rounded-md p-1.5 transition-colors duration-75 hover:bg-slate-200 focus:bg-slate-100"
              >
                <IoLink className="text-xl"></IoLink>
              </button>
            </div>
            <Calendar highlightedDates={highlightedDates}></Calendar>
          </div>
          <PlanDetailsSidebar plan={plan}></PlanDetailsSidebar>
        </div>
      )}
    </>
  );
};

function getPercentsTotal(plan: Plan): { [key: string]: number } {
  if (!plan) return {};
  if (dayjs(plan.startDate).isAfter(plan.endDate, "day")) return {};
  const availableMembers: { [key: string]: number } = {};
  const totalMembers = plan.member.length;
  let curr = dayjs(plan.startDate);
  while (!dayjs(plan.endDate).isBefore(curr, "day")) {
    const key = curr.startOf("day").toISOString();
    availableMembers[key] = 0;
    for (const member of plan.member) {
      for (const time of member.availableTimes) {
        if (curr.isSame(time, "day")) {
          if (availableMembers.hasOwnProperty(key)) {
            availableMembers[key]++;
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
