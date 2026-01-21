import { Link } from "react-router-dom";
import { useUsersList } from "../UserContext";
import "./Users.css";

const Users = () => {
  const users = useUsersList();
  return (
    <>
      {users.length === 0 ? (
        <div>Loading users...</div>
      ) : (
        <ul className="users-list">
          {users.map((u) => (
            <li key={u.id} className="user-list-item">
              <Link to={`/users/${u.id}`}>{u.username}</Link>
              <div>Blogs created: {u.blogs.length}</div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
export default Users;
