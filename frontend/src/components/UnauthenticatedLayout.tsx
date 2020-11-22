import React from "react";
import { Link } from "react-router-dom";

function UnauthenticatedLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <React.Fragment>
      <nav>
        <ul>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      {children}
    </React.Fragment>
  );
}

export { UnauthenticatedLayout };
