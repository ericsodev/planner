import useDatePicker from "./DatePicker/useDatePicker";
import { useField } from "formik";
import dayjs from "dayjs";

const propNameRegex = /^(\w+)Display/;
export default function DateField(props: any) {
  const [displayField, _, displayHelpers] = useField(props.name);
  const [field, meta, helpers] = useField(props.name.match(propNameRegex)[1]);
  const { setValue: setDisplayValue } = displayHelpers;
  const { setValue } = helpers;
  const { component, open } = useDatePicker(meta.value, (d: Date) => {
    setValue(d);
    setDisplayValue(dayjs(d).format("DD/MM/YYYY"));
  });
  return (
    <>
      {component}
      <input
        className="text-md rounded-md bg-gray-50 px-4 py-1.5 font-medium text-gray-800"
        {...props}
        onClick={open}
      >
        {props.children}
      </input>
    </>
  );
}
