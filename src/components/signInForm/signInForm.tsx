import Label from "@/components/global/Form/labelField";
import { useSession } from "@/contexts/userContext";
import { RouterOutputs, trpc } from "@/utils/trpc";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import ErrorField from "../global/Form/errorField";
import InputField from "../global/Form/inputField";
import Loading from "../Loading";

interface Props {
  plan: NonNullable<RouterOutputs["plans"]["getBySlug"]>;
}
interface FormState {
  user: string;
  password?: string;
}
export default function SignInForm({ plan }: Props): JSX.Element {
  const loginMutation = trpc.plans.authenticate.useMutation({ retry: 0 });
  const router = useRouter();
  const { login } = useSession();

  const validate = (values: FormState) => {
    const errors: any = {};
    if (!values.user) errors["user"] = "please enter a username";
    return errors;
  };
  const onSubmit = async (values: FormState) => {
    if (!plan) return;
    const member = await loginMutation.mutateAsync({
      user: values.user,
      password: values.password,
      planId: plan.id,
    });
    if (!member) return;
    if (member?.error) return;
    login({
      name: member.user ?? "",
      planId: member.planId ?? "",
      jwt: member.jwt,
    });
    router.push(`/plan/${plan.slug}/update`);
  };
  if (loginMutation.isLoading) return <Loading></Loading>;
  return (
    <div className="flex w-1/4 basis-80 flex-col justify-between gap-4 rounded-lg bg-slate-200/70 px-10 py-6">
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
            <div className="flex h-full flex-col gap-2">
              <h1 className="mb-4 text-2xl font-medium text-gray-600">
                sign in to{" "}
                <Link href={`/plan/${plan.slug}`}>
                  <strong className="font-semibold">{plan.title}</strong>
                </Link>
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
        href={`/plan/${plan.slug}/signUp`}
      >
        don&apos;t have an account yet? sign up
      </Link>
    </div>
  );
}
