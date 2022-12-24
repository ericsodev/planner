export default function InputField(props: any) {
  return (
    <input
      className="text-md rounded-md bg-gray-50 px-4 py-1.5 font-medium text-gray-800"
      {...props}
    >
      {props.children}
    </input>
  );
}
