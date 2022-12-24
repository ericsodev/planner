import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  if (!slug || typeof slug !== "string") return <></>; // TODO: redirect to error page;
  const { data, isLoading, isError } = trpc.plans.getBySlug.useQuery({
    slug: slug,
  });
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center bg-slate-50">
      {isError && <h1>error</h1>}
      {isLoading && <h1>loading...</h1>}

      <h1>{data?.title}</h1>
    </div>
  );
};

export default LoginPage;
