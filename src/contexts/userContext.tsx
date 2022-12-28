import { useState } from "react";
import React from "react";
import { useContext } from "react";

interface Session {
  name: string;
  planId: string;
  jwt?: string;
}

interface UserCtx {
  session?: Session;
  logout: () => void;
  login: (session: Session) => void;
}

const SessionCtx = React.createContext<UserCtx>({
  session: undefined,
  logout: () => {
    return;
  },
  login: (session: Session) => {
    return;
  },
});

export function SessionProvider(props: any) {
  const [session, setSession] = useState<Session | undefined>(undefined);
  return (
    <SessionCtx.Provider
      value={{
        session: session,
        logout: () => {
          setSession(undefined);
        },
        login: (session: Session) => {
          console.log(session.name);
          setSession(session);
        },
      }}
    >
      {props.children}
    </SessionCtx.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionCtx);
  return session;
}
