import { useEffect } from "react";
import { useUserValue, useUserDispatch } from "../UserContext";
import LoginForm from "./LoginForm";
import { setToken } from "../services/blogs";
import { Link } from "react-router-dom";
import "./header.css";

const NavAndLogin = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogsappUser");
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON);
      userDispatch({ type: "LOGIN", payload: userData });
      setToken(userData.token);
    }
  }, [userDispatch]);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogsappUser");
    userDispatch({ type: "LOGOUT" });
  };

  return (
    <header>
      <nav>
        <Link to="/">home</Link>
        <Link to="/users">users</Link>
      </nav>
      {user ? (
        <div className="logged-in">
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <LoginForm />
      )}
    </header>
  );
};

export default NavAndLogin;
