import type { RouterOutputs } from "@/utils/trpc";
import { useSession } from "@/contexts/userContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "../loading";

interface Props {
  member: RouterOutputs["plans"]["getBySlug"]["member"];
  selectedMember: string | null;
  setSelectedMember: React.Dispatch<React.SetStateAction<string | null>>;
}
export default function Sidebar({
  member,
  selectedMember,
  setSelectedMember,
}: Props): JSX.Element {
  const { session } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  if (!slug || typeof slug !== "string") return <Loading></Loading>;
  return (
    <div
      onClick={() => {
        setSelectedMember(null);
      }}
      className="flex flex-col"
    >
      <h1 className="mb-4 text-xl font-medium text-gray-500">members</h1>
      <ul className="flex flex-col gap-2">
        {member.map((v, _) => (
          <li
            className={`rounded-md px-4  py-1 font-medium ${
              selectedMember === v.id
                ? "bg-slate-200/80 text-gray-700"
                : "bg-slate-100 text-gray-600"
            }`}
            key={v.id}
            onClick={(e) => {
              setSelectedMember((prev) => (prev === v.id ? null : v.id));
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {v.name}
          </li>
        ))}
      </ul>
      <div className="h-auto max-h-16 grow">{/* spacer*/}</div>
      {session?.name ? (
        <Link
          href={`/plan/${slug}/update`}
          className="rounded-md bg-emerald-100 p-1.5 text-center font-medium text-emerald-900"
        >
          update schedule
        </Link>
      ) : (
        <div className="grid grid-cols-2 grid-rows-1 gap-4">
          <Link
            href={`/plan/${slug}/signUp`}
            className="rounded-md bg-emerald-100 p-1.5 text-center font-medium text-emerald-900"
          >
            sign up
          </Link>
          <Link
            href={`/plan/${slug}/signIn`}
            className="rounded-md bg-emerald-100 p-1.5 text-center font-medium text-emerald-900"
          >
            sign in
          </Link>
        </div>
      )}
    </div>
  );
}
