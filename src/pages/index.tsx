import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-16 bg-slate-100">
      <Head>
        <title>Planner</title>
      </Head>
      <h1 className="text-6xl font-semibold text-slate-700">plan it</h1>
      <Link
        href="/create"
        className="rounded-lg bg-emerald-200 px-6 py-2 text-lg font-semibold text-emerald-800"
      >
        create plan
      </Link>
    </div>
  );
};

export default Home;
