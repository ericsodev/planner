import { SessionProvider } from "@/contexts/userContext";
import type { PropsWithChildren } from "react";
import React from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SessionProvider>{props.children}</SessionProvider>
    </div>
  );
}
