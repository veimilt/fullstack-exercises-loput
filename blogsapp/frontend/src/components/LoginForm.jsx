import { useState } from "react";
import { useUserDispatch } from "../UserContext";
import * as loginService from "../services/login";
import * as blogService from "../services/blogs";
import { useNotificationDispatch } from "../NotificationContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userDispatch = useUserDispatch();
  const notificationDispatch = useNotificationDispatch();

  const showNotification = (message) => {
    notificationDispatch({ type: "SHOW", payload: message });
    setTimeout(() => {
      notificationDispatch({ type: "HIDE" });
    }, 3000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userData = await loginService.login({ username, password });
      window.localStorage.setItem(
        "loggedBlogsappUser",
        JSON.stringify(userData)
      );
      blogService.setToken(userData.token);
      userDispatch({ type: "LOGIN", payload: userData });
      setUsername("");
      setPassword("");
    } catch (error) {
      showNotification("Wrong credentials");
      console.error("Login failed:", error);
    }
  };
  return (
    <>
      <h2>Login to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;
