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
  const memberMutate = trpc.plans.changeAvailability.useMutation({});
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
      enabled: !!plan.data?.id,
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
    if (!(member.data && plan.data)) return;
    memberMutate.mutate(
      {
        dates: selectedDates,
        memberId: member.data?.id,
        planId: plan.data.id,
      },
      {
        onSuccess: () => {
          router.push(`/plan/${slug}`);
        },
      }
    );
  };

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-5 bg-slate-50">
      {error && <h1>error</h1>}
      {loading && <h1>loading</h1>}
      <h1>hi, {member.data?.name}</h1>
      <button
        className="rounded-sm bg-gray-200 px-3 py-1.5 text-lg"
        onClick={open}
      >
        set times
      </button>
      <button
        className="rounded-sm bg-green-200 px-3 py-1.5 text-lg"
        onClick={handleSubmit}
      >
        submit
      </button>
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
