import { useUsersList } from "../UserContext";
import { Link, useParams } from "react-router-dom";
import "./Users.css";

const UserView = () => {
  const { id } = useParams();
  const users = useUsersList();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return null;
  }
  return (
    <div className="user-info">
      <h2>{user.username}</h2>
      <h3>Added blogs:</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserView;
