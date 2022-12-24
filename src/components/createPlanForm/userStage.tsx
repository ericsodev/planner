import React from "react";
import Label from "../global/labelField";
import { Field, ErrorMessage } from "formik";
import ErrorField from "../global/errorField";
import InputField from "../global/inputField";

export default function UserStage() {
  return (
    <>
      <Label text={"username"}></Label>
      <Field type="input" label="user" name="user" as={InputField}></Field>
      <ErrorMessage name="user" component={ErrorField}></ErrorMessage>

      <Label text={"password (optional)"}></Label>
      <Field
        type="password"
        label="password"
        name="password"
        as={InputField}
      ></Field>
      <ErrorMessage name="password" component={ErrorField}></ErrorMessage>
    </>
  );
}
