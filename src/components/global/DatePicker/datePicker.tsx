import type { SetStateAction } from "react";
import { useState } from "react";
import DatePickerPopup from "./datePickerPopup";

interface DatePickerProps {
  hide: () => void;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
}
export default function DatePicker({
  hide,
  selectedDate,
  setSelectedDate,
}: DatePickerProps) {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0" onClick={hide}>
      <DatePickerPopup
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      ></DatePickerPopup>
      ;
    </div>
  );
}
