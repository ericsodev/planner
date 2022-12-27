import Link from "next/link";

export default function Error(): JSX.Element {
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center gap-6">
      <h1 className="text-gray-600">there was an error with your request.</h1>
      <Link
        href="/"
        className="rounded-md bg-slate-200 py-1.5 px-4 font-medium"
      >
        home
      </Link>
    </div>
  );
}
