export default function Label(props: any): JSX.Element {
  return (
    <label className="text-md font-normal text-gray-500">{props.text}</label>
  );
}
