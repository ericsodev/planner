import React from "react";
import Label from "../global/Form/labelField";
import { Field, ErrorMessage } from "formik";
import ErrorField from "../global/Form/errorField";
import DateField from "../global/Form/dateField";

interface Props {
  validate: any;
}
export default function DateStage({ validate }: Props) {
  return (
    <>
      <Label text={"start date"}></Label>
      <Field
        type="input"
        label="startDateDisplay"
        name="startDateDisplay"
        as={DateField}
        validateForm={validate}
      ></Field>
      <Label text={"end date"}></Label>
      <Field
        type="input"
        label="endDateDisplay"
        name="endDateDisplay"
        as={DateField}
        validateForm={validate}
      ></Field>
      <ErrorMessage
        name="startDateDisplay"
        component={ErrorField}
      ></ErrorMessage>
      <ErrorMessage name="user" component={ErrorField}></ErrorMessage>
    </>
  );
}
