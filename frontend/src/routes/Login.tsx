import React from "react";
import { useForm } from "react-hook-form";
import { Auth } from "../amplify";

type LoginFormValues = {
  password: string;
  email: string;
};

function Login() {
  const { register, handleSubmit } = useForm<LoginFormValues>();

  async function onLogin({ password, email }: LoginFormValues) {
    await Auth.signIn({ password, username: email });
  }

  return (
    <fieldset>
      <legend>Login</legend>
      <form onSubmit={handleSubmit(onLogin)}>
        <input type="email" name="email" placeholder="email" ref={register} />
        <input
          type="password"
          name="password"
          placeholder="password"
          ref={register}
        />
        <button type="submit">Login</button>
      </form>
    </fieldset>
  );
}

export { Login };
