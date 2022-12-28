import Link from "next/link";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center gap-6">
      <h1 className="text-gray-600">this plan does not exist.</h1>
      <Link
        href="/"
        className="rounded-md bg-emerald-200 py-2 px-4 font-medium text-emerald-800 hover:bg-emerald-300 focus:bg-emerald-300/80"
      >
        back to home
      </Link>
    </div>
  );
}
