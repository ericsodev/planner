import React from "react";
import { Field, ErrorMessage } from "formik";
import InputField from "../global/Form/inputField";
import Label from "../global/Form/labelField";
import ErrorField from "../global/Form/errorField";

export default function NameStage() {
  return (
    <>
      <Label text={"plan name"}></Label>
      <Field type="input" label="title" name="title" as={InputField}></Field>
      <ErrorMessage name="title" component={ErrorField}></ErrorMessage>
    </>
  );
}
