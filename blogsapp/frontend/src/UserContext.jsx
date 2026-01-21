import { createContext, useReducer, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./services/users";

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  // Fetching users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

  return (
    <UserContext.Provider value={[user, userDispatch, users]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserValue = () => {
  const context = useContext(UserContext);
  return context[0];
};

export const useUserDispatch = () => {
  const context = useContext(UserContext);
  return context[1];
};

export const useUsersList = () => {
  const context = useContext(UserContext);
  return context[2];
};

export default UserContext;
