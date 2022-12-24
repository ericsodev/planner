import dayjs from "dayjs";
interface DayProps {
  date: Date;
}
export default function Day(props: DayProps): JSX.Element {
  return <div>{dayjs(props.date).format("D")}</div>;
}
