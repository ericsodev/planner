import React from "react";
import { Field, ErrorMessage } from "formik";
import InputField from "../global/inputField";
import Label from "../global/labelField";
import ErrorField from "../global/errorField";

export default function NameStage() {
  return (
    <>
      <Label text={"plan name"}></Label>
      <Field type="input" label="name" name="name" as={InputField}></Field>
      <ErrorMessage name="name" component={ErrorField}></ErrorMessage>
    </>
  );
}
