import dayjs from "dayjs";
import { useField } from "formik";
import { useEffect } from "react";
import useDatePicker from "../DatePicker/useDatePicker";

const propNameRegex = /^(\w+)Display/;
export default function DateField(props: any) {
  const [displayField, _, displayHelpers] = useField(props.name);
  const [field, meta, helpers] = useField(props.name.match(propNameRegex)[1]);
  const { setValue: setDisplayValue } = displayHelpers;
  const { setValue } = helpers;
  const { component, open } = useDatePicker({
    initialDates: [meta.initialValue],
    onChange: (d: Date[]) => {
      setValue(d[0]);
      setDisplayValue(dayjs(d[0]).format("DD/MM/YYYY"));
    },
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
