import { useState } from "react";
import React from "react";
import { useContext } from "react";

interface PropContext {
  selectableDates?: Date[];
  highlightedDates?: Date[];
  selectedDates: Date[];
  setDate?: (date: Date) => void;
  toggleDate?: (date: Date) => void;
}

const PropContext = React.createContext<PropContext>({ selectedDates: [] });

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
