import React from "react";
import type { AuthClass } from "@aws-amplify/auth/lib-esm/Auth";
import { withSSRContext } from "aws-amplify";

const { Auth }: { Auth: AuthClass } = withSSRContext();

Auth.configure({
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_hp4H9PwER",
  aws_user_pools_web_client_id: "3m4kt1jcl04idmj5jlka784p7i"
});

type State = {
  authenticated: boolean;
  loading: boolean;
};

function useIsAuthenticated() {
  const [state, setState] = React.useState<State>({
    authenticated: false,
    loading: true
  });

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const user = await Auth.currentUserInfo();

        setState({ authenticated: Boolean(user), loading: false });
      } catch (e) {
        setState({ authenticated: false, loading: false });
      }
    }

    checkAuth();
  }, []);

  return state;
}

export { Auth, useIsAuthenticated };
