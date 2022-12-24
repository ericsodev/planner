import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import DatePicker from "./datePicker";
import { PropProvider } from "./propContext";

interface Props {
  initialDates?: Date[];
  onChange?: (dates: Date[]) => void;
  multiSelect?: boolean;
  highlightedDates?: Date[];
  selectableDates?: Date[];
}
export default function useDatePicker({
  initialDates,
  onChange,
  multiSelect,
  highlightedDates,
  selectableDates,
}: Props) {
  const [hidden, setHidden] = useState(true);
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    initialDates ?? [new Date()] // TODO: if multiselect, then default should be empty array
  );
  const ref = useRef<(dates: Date[]) => void | undefined>();
  ref.current = onChange;
  useEffect(() => {
    if (ref.current) {
      ref.current(selectedDates);
    }
  }, [selectedDates]);
  const setDate = (date: Date) => {
    setSelectedDates([dayjs(date).endOf("day").toDate()]);
  };
  const toggleDate = (date: Date) => {
    setSelectedDates((prev) => {
      return toggleDateHelper(prev, date);
    });
  };
  return {
    component: (
      <>
        <PropProvider
          value={{
            highlightedDates: highlightedDates,
            selectableDates: selectableDates,
            selectedDates: selectedDates,
            toggleDate: multiSelect ? toggleDate : undefined,
            setDate: !multiSelect ? setDate : undefined,
          }}
        >
          {!hidden && (
            <DatePicker
              hide={() => {
                setHidden(true);
              }}
            ></DatePicker>
          )}
        </PropProvider>
      </>
    ),
    selectedDates: selectedDates,
    open: () => {
      setHidden(false);
    },
  };
}

function toggleDateHelper(prev: Date[], date: Date): Date[] {
  const newList = prev.filter((d) => !dayjs(d).isSame(date, "day"));
  if (newList.length < prev.length) return newList;

  newList.push(date);
  return newList;
}
