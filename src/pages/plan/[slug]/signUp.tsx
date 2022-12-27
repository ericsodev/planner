import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Error from "@/components/error";
import Loading from "@/components/loading";

const SignUpPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const {
    data: plan,
    isLoading,
    isError,
  } = trpc.plans.getBySlug.useQuery({
    slug: typeof slug === "string" ? slug : "",
  });
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center bg-slate-50">
      {isError && <Error></Error>}
      {isLoading && <Loading></Loading>}
      {plan && <h1>{plan?.title}</h1>}
    </div>
  );
};

export default SignUpPage;
