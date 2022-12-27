import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Calendar from "@/components/calendar";

const PlanPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  if (!slug || typeof slug !== "string") return <></>; // TODO: redirect to error page;
  const { data, isLoading, isError } = trpc.plans.getBySlug.useQuery({
    slug: slug,
  });
  return (
    <div className="grid min-h-screen grid-cols-[1fr_3fr_1fr] gap-6 bg-slate-50 px-12 py-6">
      {isError && <h1>error</h1>}
      {isLoading && <h1>loading...</h1>}

      <div>
        {/* members sidebar */}
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto vel,
        totam quam officia quia libero. Maxime facilis nemo magni dicta, non
        harum animi vero, dolores autem fugiat blanditiis! Voluptatem, at.
      </div>
      <div className="flex flex-col gap-12">
        <h1 className="text-center text-xl">{data?.title}</h1>
        <Calendar></Calendar>
      </div>
      <div>
        {/* selected details sidebar */}\ Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Similique illum, nihil sit, praesentium nostrum culpa
        fugit ipsa facilis nesciunt fugiat eveniet beatae, officiis dignissimos
        velit dolore deserunt veniam labore quos.
      </div>
    </div>
  );
};

export default PlanPage;
