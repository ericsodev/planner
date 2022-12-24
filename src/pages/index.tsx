import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreatePlanForm from "../components/createPlanForm";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const plan = trpc.plans.create.useMutation();
  const createPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    plan.mutate({
      title: name,
      startDate: new Date(),
      endDate: new Date(),
    });
  };
  if (plan.isSuccess) {
    router.push(`/plan/${plan.data?.slug}`);
  }
  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-16 bg-slate-200">
      <h1 className="text-6xl font-semibold text-slate-700">plan it</h1>
      <Link href="/create">
        <button className="rounded-lg bg-green-300 px-6 py-2 text-lg font-semibold text-green-800">
          start a plan
        </button>
      </Link>
    </div>
  );
};

export default Home;
