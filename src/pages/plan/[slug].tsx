import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const PlanPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  if (!slug || typeof slug !== "string") return <></>;
  const { data, isLoading, isError } = trpc.plans.getBySlug.useQuery({
    slug: slug,
  });
  if (isError) return <div>some error</div>;
  if (isLoading) return <div>loading ...</div>;
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center bg-slate-200 bg-slate-50">
      <h1>{data.title}</h1>
    </div>
  );
};

export default PlanPage;
