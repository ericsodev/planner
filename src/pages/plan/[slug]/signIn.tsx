import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import SignInForm from "@/components/signInForm";
import { useSession } from "@/contexts/userContext";
import NotFound from "@/components/NotFound";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { session } = useSession();
  const { slug } = router.query;
  if (!slug || typeof slug !== "string") return <></>; // TODO: redirect to error page;
  const {
    data: plan,
    isLoading,
    isError,
  } = trpc.plans.getBySlug.useQuery(
    {
      slug: slug,
    },
    { enabled: typeof slug === "string" }
  );
  if (session?.name) router.push(`/plan/${slug}`);
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center bg-slate-50">
      {isError && <h1>error</h1>}
      {isLoading && <h1>loading...</h1>}
      {plan === null && <NotFound></NotFound>}
      {plan && (
        <>
          <Head>
            <title>{plan.title} | sign up</title>
          </Head>
          <SignInForm plan={plan}></SignInForm>
        </>
      )}
    </div>
  );
};

export default LoginPage;
