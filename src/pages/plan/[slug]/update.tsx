import useDatePicker from "@/components/global/DatePicker/useDatePicker";
import { useSession } from "@/contexts/userContext";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

/*
Assume user has authenticated if user value is present
*/
const UpdatePage: NextPage = () => {
  const router = useRouter();
  const memberMutate = trpc.plans.changeAvailability.useMutation();
  const { slug } = router.query;
  const { session } = useSession();
  const plan = trpc.plans.getBySlug.useQuery({
    slug: typeof slug === "string" ? slug : "",
  });
  useEffect(() => {
    if (!slug) router.push(`/`);
    if (!session) router.push(`/plan/${slug}/signUp`);
  }, [session, router, slug]);

  const member = trpc.plans.getMember.useQuery(
    {
      name: session?.name || "",
      planId: session?.planId || "",
    },
    {
      enabled: !!plan.data,
    }
  );
  const dateRange = plan.data
    ? generateDateRange(plan.data.startDate, plan.data.endDate)
    : [];
  const {
    component: DatePicker,
    open,
    selectedDates,
  } = useDatePicker({
    initialDates: member.data?.availableTimes ?? [],
    multiSelect: true,
    highlightedDates: dateRange,
    selectableDates: dateRange,
  });

  const loading = member.isLoading || plan.isLoading;
  const error = member.isError || plan.isError;
  const handleSubmit = () => {
    console.log(session);
    console.log(member.data);
    console.log(plan.data);
    if (!(member.data && plan.data)) return;
    memberMutate.mutate(
      {
        dates: selectedDates,
        memberId: member.data?.id,
        planId: plan.data.id,
        jwt: session?.jwt,
      },
      {
        onSuccess: () => {
          router.push(`/plan/${slug}`);
        },
      }
    );
  };

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-5 self-center bg-slate-50">
      {error && <h1>error</h1>}
      {loading && <h1>loading</h1>}
      <div className="grid grid-cols-1 gap-4">
        <h1 className="text-center text-gray-800">
          hey there, <strong className="font-semibold">{session?.name}</strong>
        </h1>
        <button
          className="rounded-md bg-violet-200 p-1.5 px-4 text-center font-medium text-violet-900 transition-colors duration-75 hover:bg-violet-200/80 focus:bg-violet-200/40"
          onClick={open}
        >
          set times
        </button>
        <button
          className="rounded-md bg-emerald-100 p-1.5 px-10 text-center font-medium text-emerald-900 transition-colors duration-75 hover:bg-emerald-200/80 focus:bg-emerald-200/40"
          onClick={handleSubmit}
        >
          submit
        </button>
      </div>
      {DatePicker}
    </div>
  );
};

function generateDateRange(start: Date, end: Date) {
  let i = 0;
  const dates: Date[] = [];
  while (!dayjs(start).add(i, "day").isAfter(end, "day")) {
    dates.push(dayjs(start).add(i, "day").toDate());
    i++;
  }
  return dates;
}

export default UpdatePage;
