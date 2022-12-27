import { useState } from "react";
import React from "react";
import { useContext } from "react";

interface HighlightedDate {
  day: Date;
  style: string;
}

interface PropContext {
  highlightedDates?: HighlightedDate[];
}

const PropContext = React.createContext<PropContext>({});

interface Props extends React.PropsWithChildren {
  value: PropContext;
}
export function PropProvider({ value, children }: Props) {
  return <PropContext.Provider value={value}>{children}</PropContext.Provider>;
}

export function useProps() {
  const props = useContext(PropContext);
  return props;
}
