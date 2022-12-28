import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Error from "@/components/error";
import Loading from "@/components/loading";
import SignUpForm from "@/components/signUpForm/signUpForm";
import Head from "next/head";
import { useSession } from "@/contexts/userContext";
import NotFound from "@/components/NotFound";

const SignUpPage: NextPage = () => {
  const router = useRouter();
  const { session } = useSession();
  const { slug } = router.query;
  const {
    data: plan,
    isLoading,
    isError,
  } = trpc.plans.getBySlug.useQuery({
    slug: typeof slug === "string" ? slug : "",
  });
  if (session?.name) router.push(`/plan/${slug}`);
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center bg-slate-50">
      {isError && <Error></Error>}
      {isLoading && <Loading></Loading>}
      {plan === null && <NotFound></NotFound>}
      {plan && (
        <>
          <Head>
            <title>{plan.title} | sign up</title>
          </Head>
          <SignUpForm plan={plan}></SignUpForm>
        </>
      )}
    </div>
  );
};

export default SignUpPage;
