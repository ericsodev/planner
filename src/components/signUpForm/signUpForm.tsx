import Label from "@/components/global/Form/labelField";
import { useSession } from "@/contexts/userContext";
import { RouterOutputs, trpc } from "@/utils/trpc";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import ErrorField from "../global/Form/errorField";
import InputField from "../global/Form/inputField";
import Link from "next/link";
interface Props {
  plan: RouterOutputs["plans"]["getBySlug"];
}
interface FormState {
  user: string;
  password?: string;
}
export default function SignUpForm({ plan }: Props): JSX.Element {
  const memberMutation = trpc.plans.addMember.useMutation({ retry: 0 });
  const router = useRouter();
  const { login } = useSession();
  const memberList = plan.member.map((v) => v.name);
  const validate = (values: FormState) => {
    const errors: any = {};
    if (!values.user) errors["user"] = "please enter a username";
    if (memberList.includes(values.user))
      errors["user"] = "username has been taken";
    return errors;
  };
  const onSubmit = async (values: FormState) => {
    const member = await memberMutation.mutateAsync({
      dates: [],
      planId: plan.id,
      name: values.user,
      password: values.password,
    });
    login({ name: member.user, planId: member.planId, jwt: member.jwt });
    router.push(`/plan/${plan.slug}/update`);
  };
  return (
    <div className="flex basis-80 flex-col justify-between gap-4 rounded-lg  bg-slate-200/70 px-10 py-6 lg:w-1/4 2xl:w-1/5">
      <Formik
        initialValues={{
          user: "new user",
          password: undefined,
        }}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values).then(() => {
            setSubmitting(false);
          });
        }}
      >
        {({}) => (
          <Form className="h-full">
            <div className="flex h-full flex-col gap-3">
              <h1 className="mb-4 text-2xl font-medium text-gray-600">
                sign up for{" "}
                <strong className="font-semibold">{plan.title}</strong>
              </h1>
              <Label text={"username"}></Label>
              <Field
                type="input"
                label="user"
                name="user"
                as={InputField}
              ></Field>
              <ErrorMessage name="user" component={ErrorField}></ErrorMessage>

              <Label text={"password (optional)"}></Label>
              <Field
                type="password"
                label="password"
                name="password"
                as={InputField}
              ></Field>
              <ErrorMessage
                name="password"
                component={ErrorField}
              ></ErrorMessage>
              <button
                type="submit"
                className="self-stretch rounded-md bg-emerald-200 p-2 font-medium text-emerald-800 hover:bg-emerald-300 focus:bg-emerald-300/80"
              >
                submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <Link
        className="mt-auto rounded-md bg-violet-200 p-1.5 px-4 text-center font-medium text-violet-900 transition-colors duration-75 hover:bg-violet-200/80 focus:bg-violet-200/40"
        href={`/plan/${plan.slug}/signIn`}
      >
        have an account? sign in
      </Link>
    </div>
  );
}
