import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { Login } from "./routes/Login";
import { Register } from "./routes/Register";
import { User } from "./routes/User";
import { Posts } from "./routes/Posts";
import { useIsAuthenticated } from "./amplify";
import { UnauthenticatedLayout } from "./components/UnauthenticatedLayout";
import { AuthenticatedLayout } from "./components/AuthenticatedLayout";

function App() {
  const { authenticated, loading } = useIsAuthenticated();
  if (loading) return <p>loading...</p>;

  if (!authenticated) return <UnauthenticatedApp />;

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/user" exact={true}>
          <User />
        </Route>
        <Route path="/posts" exact={true}>
          <Posts />
        </Route>
        <Route path="*">
          <Redirect to="/user" />
        </Route>
      </Switch>
    </AuthenticatedLayout>
  );
}

function UnauthenticatedApp() {
  return (
    <UnauthenticatedLayout>
      <Switch>
        <Route path="/register" exact={true}>
          <Register />
        </Route>
        <Route path="/login" exact={true}>
          <Login />
        </Route>
        <Route path="*">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </UnauthenticatedLayout>
  );
}

export default App;
