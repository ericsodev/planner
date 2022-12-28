import DatePickerPopup from "./datePickerPopup";

interface DatePickerProps {
  hide: () => void;
}
export default function DatePicker({ hide }: DatePickerProps) {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0" onClick={hide}>
      <DatePickerPopup></DatePickerPopup>;
    </div>
  );
}
