import { Auth } from "../amplify";
import React from "react";
import { Link } from "react-router-dom";

function AuthenticatedLayout({ children }: React.PropsWithChildren<{}>) {
  async function onLogout() {
    await Auth.signOut();
  }

  return (
    <React.Fragment>
      <nav>
        <button onClick={onLogout}>Logout</button>
        <ul>
          <li>
            <Link to="/user">User</Link>
          </li>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
        </ul>
      </nav>
      {children}
    </React.Fragment>
  );
}

export { AuthenticatedLayout };
