import React from "react";
import { useForm } from "react-hook-form";
import { Auth } from "../amplify";

type RegisterFormValues = {
  password: string;
  email: string;
};

function Register() {
  const { register, handleSubmit } = useForm<RegisterFormValues>();

  async function onRegister({ password, email }: RegisterFormValues) {
    await Auth.signUp({ password, username: email });
    await Auth.signIn({ password, username: password });
  }

  return (
    <fieldset>
      <legend>Register</legend>
      <form onSubmit={handleSubmit(onRegister)}>
        <input type="email" name="email" placeholder="email" ref={register} />
        <input
          type="password"
          name="password"
          placeholder="password"
          ref={register}
        />
        <button type="submit">Register</button>
      </form>
    </fieldset>
  );
}

export { Register };
