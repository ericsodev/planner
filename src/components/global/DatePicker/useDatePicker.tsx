import { useEffect, useRef, useState } from "react";
import DatePicker from "./datePicker";

export default function useDatePicker(
  initialDate?: Date,
  onChange?: (date: Date) => void
) {
  const [hidden, setHidden] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate ?? new Date()
  );
  const ref = useRef<(date: Date) => void | undefined>();
  ref.current = onChange;
  useEffect(() => {
    if (ref.current) {
      ref.current(selectedDate ?? new Date());
    }
  }, [selectedDate]);
  return {
    component: (
      <>
        {!hidden && (
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            hide={() => {
              setHidden(true);
            }}
          ></DatePicker>
        )}
      </>
    ),
    selectedDate: selectedDate,
    open: () => {
      setHidden(false);
    },
  };
}
