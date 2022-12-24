// stage 0. input name (index)
// stage 1. input 2 date range
// stage 2. add user (+ password)
const NUM_STAGES = 3;

import { Form, Formik } from "formik";
import dayjs from "dayjs";
import { useState } from "react";
import DateStage from "./dateStage";
import NameStage from "./nameStage";
import UserStage from "./userStage";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

// stage 2.1. add availability or skip
export default function CreatePlanForm() {
  const [stage, setStage] = useState(0);
  const onNext = () => {
    setStage((stage) => (stage < NUM_STAGES - 1 ? stage + 1 : stage));
  };
  const onPrev = () => {
    setStage((stage) => (stage > 0 ? stage - 1 : stage));
  };
  const getStage = (validateForm: any) => {
    switch (stage) {
      case 0:
        return <NameStage></NameStage>;
      case 1:
        return <DateStage validate={validateForm}></DateStage>;
      case 2:
        return <UserStage></UserStage>;
      default:
        return <></>;
    }
  };
  return (
    <div className="flex h-full min-h-full grow flex-col items-center justify-center gap-16">
      <div className="flex w-1/4 basis-80 flex-col justify-between gap-2 rounded-lg bg-slate-200/70 px-10 py-6">
        <Formik
          initialValues={{
            name: "untitled plan",
            startDate: new Date(),
            endDate: dayjs().add(1, "day").toDate(),
            startDateDisplay: dayjs().format("DD/MM/YYYY"),
            endDateDisplay: dayjs(new Date())
              .add(1, "day")
              .format("DD/MM/YYYY"),
            user: "new user",
            password: "",
          }}
          validate={validate}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));

              setSubmitting(false);
            }, 200);
          }}
        >
          {({ validateForm }) => (
            <Form className="h-full">
              <div className="flex h-full flex-col gap-2">
                <h1 className="text-4xl font-semibold text-gray-600">
                  new plan
                </h1>
                {getStage(validateForm)}
                <div className="mt-auto flex flex-row justify-between gap-2">
                  {stage > 0 && (
                    <button
                      type="button"
                      onClick={onPrev}
                      className="rounded-md bg-gray-300 p-1 text-3xl text-gray-700"
                    >
                      <MdOutlineNavigateBefore></MdOutlineNavigateBefore>
                    </button>
                  )}
                  {stage < NUM_STAGES - 1 && (
                    <button
                      type="button"
                      onClick={onNext}
                      className="ml-auto rounded-md bg-gray-300 p-1 text-3xl text-gray-700"
                    >
                      <MdOutlineNavigateNext></MdOutlineNavigateNext>
                    </button>
                  )}
                  {stage === NUM_STAGES - 1 && (
                    <button
                      type="submit"
                      className="ml-auto rounded-md bg-gray-300 py-1 px-4 text-lg text-gray-700"
                    >
                      submit
                    </button>
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

interface FormState {
  name: string;
  startDate: Date;
  endDate: Date;
  user: string;
  password: string;
}
function validate(values: FormState) {
  const errors: any = {};

  if (!values.name) errors.name = "provide a name for your plan";
  if (dayjs(values.startDate).isAfter(dayjs(values.endDate), "day")) {
    errors.startDateDisplay = "the start date cannot be after the end date";
  }
  if (!values.user) errors.user = "provide a name for your user";
  console.log("validating", errors);
  return errors;
}
