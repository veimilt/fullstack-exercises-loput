import { useUserValue, useUserDispatch, useUsersList } from "./UserContext";

import Notification from "./components/Notification";
import Users from "./components/Users";
import UserView from "./components/UserView";
import NavAndLogin from "./components/NavAndLogin";
import BlogsList from "./components/BlogsList";
import BlogView from "./components/BlogView";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";

const App = () => {
  const user = useUserValue();
  return (
    <Router>
      <div>
        <NavAndLogin />
        <h1>blogs app</h1>
        <Notification />
        <Routes>
          <Route path="/" element={<BlogsList />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
        {/* <BlogsList /> */}
        {/* <BlogView /> */}
      </div>
    </Router>
  );
};

export default App;
